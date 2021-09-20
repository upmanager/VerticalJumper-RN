import * as reduxActions from "@actions";
import { RangeSlider, Text } from "@components";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon } from "react-native-elements";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ModalSelector from 'react-native-modal-selector';
import VideoPlayer from 'react-native-video';
import { connect } from 'react-redux';
// import VideoPlayer from 'react-native-video-controls';

const Calcuate = (props) => {
    const { params } = props.route;
    const { jumpers } = props.app;
    const [selectedKey, setSelectedKey] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [selected_video, setSelected_video] = useState('');
    const [videoFrom, setVideoFrom] = useState(0);
    const [videoTo, setVideoTo] = useState(1);
    const [mSpeed, setVideoSpeed] = useState(1);
    const [isCM, setCM] = useState(false);
    const _video = useRef();

    useEffect(() => {
        setSelectedKey(params?.data?.key);
    }, [params, params?.data?.key]);
    const initValue = () => {
        return jumpers.find(item => item.key == selectedKey)?.name;
    }
    const onChooseVideo = useCallback((data) => {
        // {"assets": [{"duration": 2, "fileName": "rn_image_picker_lib_temp_0f7c6a33-aae8-42ed-b896-e36232b7bbf1.mp4", "fileSize": 2239656, "uri": "file:///data/user/0/com.verticaljumper/cache/rn_image_picker_lib_temp_0f7c6a33-aae8-42ed-b896-e36232b7bbf1.mp4"}]}
        try {
            if (data.didCancel) {
                return;
            }
            const { uri, duration } = data.assets[0];
            setSelected_video(uri);
            setVideoDuration(duration);
            // setVideoTo(duration);
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
    const onSpeedDown = () => {
        let speed = mSpeed;
        if (speed > 3) {
            speed -= 2;
        } else if (speed > 1) {
            speed = 1;
        } else if (speed > .3) {
            speed -= .2;
        }
        speed = getNum(speed);
        if (speed < 0) speed = 0;
        setVideoSpeed(speed);
    }
    const onSpeedMedium = () => {
        setVideoSpeed(1);
    }
    const onSpeedUp = () => {
        let speed = mSpeed;
        if (speed < 1) {
            speed += .2;
        } else if (speed < 3) {
            speed += 1;
        } else {
            speed += 2;
        }
        speed = getNum(speed);
        setVideoSpeed(speed);

    }
    const setVideoFromTime = (v) => {
        if (v < 0) v = 0;
        if (v >= videoTo) v = videoTo - .01;
        setVideoFrom(v);
    }
    setVideoToTime = (v) => {
        if (v <= videoFrom) v = videoFrom + .01;
        if (v > videoDuration) v = videoDuration;
        setVideoTo(v);
    }
    const set2Low = () => {
        setVideoFromTime(global.currentTime);
    }
    const set2High = () => {
        setVideoToTime(global.currentTime);
    }
    const renderControl = (icon, action, type) => (
        <TouchableOpacity onPress={action} style={[{ marginHorizontal: 4, flex: 1, padding: 15 }]}>
            <Icon name={icon} color={"#0083ff"} type={type || 'entypo'} size={36} />
        </TouchableOpacity>
    )
    const saveHeight = () => {
        if (!selectedKey) {
            return alert("Select the jumper.");
        }
        props.saveHeight({ key: selectedKey, height: getHeight() });
    }
    const getNum = (_v) => {
        return parseInt(_v * 100) / 100;
    }
    const getHeight = (checkUnit = false) => { //get height inch
        // height = 0.5 x 9.81 m/(s^2) x (hang time / 2 )^2
        // https://www.topendsports.com/testing/products/vertical-jump/video.htm
        let height = 0.5 * 9.81 * Math.pow((1.12) / 2, 2); //height by meter
        height *= 100; //height by centimeter
        if (checkUnit && !isCM) {
            height /= 2.54;
        }
        return getNum(height);
    }
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
                        <VideoPlayer
                            ref={_video}
                            source={{ uri: selected_video }}
                            style={styles.videoView}
                            resizeMode={'contain'}
                            navigator={props.navigator}
                            seek={100}
                            controls
                            rate={mSpeed}
                        />
                        <View style={[styles.buttons, { paddingHorizontal: 30 }]}>
                            {renderControl("speedometer-slow", onSpeedDown, "material-community")}
                            <TouchableOpacity style={{ flex: 2, justifyContent: "center", alignItems: "center" }} onPress={onSpeedMedium}>
                                <Text title3 primaryColor bold>Speed: {mSpeed} x</Text>
                            </TouchableOpacity>
                            {renderControl("speedometer", onSpeedUp, "material-community")}
                        </View>

                        <View style={styles.buttons}>
                            <Button title={'Take-off'} buttonStyle={{ margin: 10 }} onPress={set2Low} />
                            <Button title={'Landing'} buttonStyle={{ margin: 10 }} onPress={set2High} />
                        </View>

                        <View style={{ paddingHorizontal: 60, paddingVertical: 10 }}>
                            <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                                <Text title3>Time at Take-off</Text>
                                <Text title3 blackColor>{getNum(videoFrom)} s</Text>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                                <Text title3>Time at Landing</Text>
                                <Text title3 blackColor>{getNum(videoTo)} s</Text>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                                <Text title3>Hang Time</Text>
                                <Text title3 blackColor>{videoFrom > 0 && videoTo > 0 ? getNum(videoTo - videoFrom) : 0}s</Text>
                            </View>
                            <TouchableOpacity onPress={() => setCM(!isCM)} style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
                                <Text title3 primaryColor bold>Height</Text>
                                <Text title3 primaryColor bold>{getHeight(true)} {isCM ? "cm" : "inch"}</Text>
                            </TouchableOpacity>
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