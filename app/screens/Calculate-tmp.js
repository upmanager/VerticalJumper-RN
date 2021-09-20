import * as reduxActions from "@actions";
import { RangeSlider, Text } from "@components";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon } from "react-native-elements";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ModalSelector from 'react-native-modal-selector';
import Video from 'react-native-video';
import { connect } from 'react-redux';

const Calcuate = (props) => {
    const { params } = props.route;
    const { jumpers } = props.app;
    const [selectedKey, setSelectedKey] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [selected_video, setSelected_video] = useState('');
    const [videoFrom, setVideoFrom] = useState(0);
    const [videoTo, setVideoTo] = useState(1);
    const [isPause, setIsPause] = useState(true);
    const _video = useRef();
    useEffect(() => {
        global.cur_change = 0; //0: no, 1: low, 2: high
    }, [])
    useEffect(() => {
        setSelectedKey(params?.data?.key);
    }, [params, params?.data?.key]);
    const initValue = () => {
        return jumpers.find(item => item.key == selectedKey)?.name;
    }
    const onChooseVideo = useCallback((data) => {
        // {"assets": [{"duration": 2, "fileName": "rn_image_picker_lib_temp_0f7c6a33-aae8-42ed-b896-e36232b7bbf1.mp4", "fileSize": 2239656, "uri": "file:///data/user/0/com.verticaljumper/cache/rn_image_picker_lib_temp_0f7c6a33-aae8-42ed-b896-e36232b7bbf1.mp4"}]}
        try {
            const { uri, duration } = data.assets[0];
            setSelected_video(uri);
            setVideoDuration(duration);
            setVideoTo(duration);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const ChooseVideo = (isCamera) => {
        const options = {
            mediaType: 'video',
            videoQuality: "high",
        };
        if (isCamera) {
            launchCamera(options, onChooseVideo);
        } else {
            launchImageLibrary(options, onChooseVideo);
        }
    }
    const onLoad = (data) => {
    }
    const handleValueChange = useCallback((v_from, v_to, low, high) => {
        if (global.cur_change == 1 || parseInt(v_from) != parseInt(low)) {
            videoSeekTo(low);
        } else if (global.cur_change == 2 || parseInt(v_to) != parseInt(high)) {
            videoSeekTo(high);
        }
        global.cur_change = 0;
        setVideoFrom(low);
        setVideoTo(high);
    }, []);

    const onLeftStep1 = () => onLowStep(-.1);
    const onLeftStep2 = () => onLowStep(-.05);
    const onLeftStep3 = () => onLowStep(.05);
    const onLeftStep4 = () => onLowStep(.1);

    const onRightStep1 = () => onHighStep(-.1);
    const onRightStep2 = () => onHighStep(-.05);
    const onRightStep3 = () => onHighStep(.05);
    const onRightStep4 = () => onHighStep(.1);
    const onLowStep = (v) => {
        global.cur_change = 1;
        let new_low = videoFrom + v;
        setVideoFromTime(new_low);
    }
    const setVideoFromTime = (v) => {
        if (v < 0) v = 0;
        if (v >= videoTo) v = videoTo - 1;
        setVideoFrom(v);
    }
    const onHighStep = (v) => {
        global.cur_change = 2;
        let new_high = videoTo + v;
        setVideoToTime(new_high);
    }
    setVideoToTime = (v) => {
        if (v <= videoFrom) v = videoFrom + 1;
        if (v > videoDuration) v = videoDuration;
        setVideoTo(v);
    }
    const videoSeekTo = (seek) => {
        _video.current?.seek?.(seek);
    }
    const set2Low = () => {
        setVideoFromTime(global.currentTime);
    }
    const set2High = () => {
        setVideoToTime(global.currentTime);
    }
    const playVideo = () => {
        videoSeekTo(videoFrom);
        setIsPause(!isPause);
    }
    const renderControl = (icon, action, style) => (
        <TouchableOpacity onPress={action} style={[{ marginHorizontal: 4 }, style]}>
            <Icon name={icon} color={"#000"} type={'entypo'} size={34} />
        </TouchableOpacity>
    )
    const saveHeight = () => {
        if (!selectedKey) {
            return alert("Select the jumper.");
        }
        props.saveHeight({ key: selectedKey, height });
    }
    // 0.5 x 9.81 m/s (squared) x (time in air / 2)(squared).
    const seconds = parseInt((videoTo - videoFrom) * 10) / 10;
    const height = parseInt((0.5 * 9.81 * Math.sqrt((seconds) / 2)) * 100) / 100;

    return (
        <SafeAreaView>
            <ModalSelector
                data={jumpers}
                initValue={initValue() || "Select Jumpers!"}
                initValueTextStyle={{ color: "#000", fontSize: 20 }}
                style={{ marginBottom: 10 }}
                labelExtractor={data => data.name}
                onChange={(option) => setSelectedKey(option.key)} />
            <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
                <View style={styles.buttons}>
                    <Button title={'Take from Camera'} buttonStyle={{ margin: 10 }} onPress={() => ChooseVideo(true)} />
                    <Button title={'Select from Gallery'} buttonStyle={{ margin: 10 }} onPress={() => ChooseVideo(false)} />
                </View>
                {!!selected_video &&
                    <>
                        <Video
                            ref={_video}
                            source={{ uri: selected_video }}
                            style={styles.videoView}
                            resizeMode={'contain'}
                            onLoad={onLoad}
                            navigator={props.navigator}
                            controls={true}
                            controlTimeout={9999}
                            paused={isPause}
                            seek={100}
                            onProgress={d => {
                                global.currentTime = d.currentTime;
                                if (d.currentTime >= videoTo) {
                                    setIsPause(true);
                                    videoSeekTo(videoFrom);
                                }
                            }}
                            onSeek={(data) => console.log("video onseek", data)}
                        />
                        <RangeSlider
                            min={0}
                            max={videoDuration > 1 ? videoDuration : 1}
                            style={{ paddingHorizontal: 20 }}
                            low={videoFrom}
                            high={videoTo}
                            step={.01}
                            handleValueChange={(low, high) => handleValueChange(videoFrom, videoTo, low, high)} />
                        <View style={styles.buttons}>
                            <Button title={'Set to Low'} buttonStyle={{ margin: 10 }} onPress={set2Low} />
                            <Button title={'Set to High'} buttonStyle={{ margin: 10 }} onPress={set2High} />
                        </View>
                        <View style={styles.buttons}>
                            {renderControl("controller-fast-backward", onLeftStep1)}
                            {renderControl("controller-jump-to-start", onLeftStep2)}
                            {renderControl("controller-next", onLeftStep3)}
                            {renderControl("controller-fast-forward", onLeftStep4)}
                            {renderControl(isPause ? "controller-play" : "controller-paus", playVideo, { flex: 1 })}
                            {renderControl("controller-fast-backward", onRightStep1)}
                            {renderControl("controller-jump-to-start", onRightStep2)}
                            {renderControl("controller-next", onRightStep3)}
                            {renderControl("controller-fast-forward", onRightStep4)}
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                            {/* 0.5 x 9.81 m/s (squared) x (time in air / 2)(squared). */}
                            <Text title2>{`Duration: ${seconds}s Height: ${height} m`}</Text>
                        </View>
                        <Button title={'Save'} buttonStyle={{ margin: 20, marginHorizontal: "20%" }} onPress={saveHeight} />
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(Calcuate);
const styles = StyleSheet.create({
    videoView: {
        width: "100%",
        height: 250,
        backgroundColor: "#000"
    },
    buttons: {
        flexDirection: "row",
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    }
})