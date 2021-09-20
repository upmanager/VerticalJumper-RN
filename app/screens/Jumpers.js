import * as reduxActions from "@actions";
import { LoadingHeader, Text } from "@components";
import { BaseColor } from "@config";
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from "react-native-elements";
import { connect } from 'react-redux';

const Jumpers = (props) => {
    const { jumpers } = props.app;
    const [jumperName, setJumperName] = useState("")
    useEffect(() => {
    }, [])
    const addJumper = () => {
        const name = jumperName.trim();
        if (!name) {
            return alert("Input the jumper name");
        }
        setJumperName("");
        const index = jumpers.findIndex(item => item == name);
        if (index >= 0) return alert("This user already exists");
        const key = (new Date()).getTime();
        props.addJumper({ key, name });
    }
    const deleteJumper = (name) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this jumper?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        props.removeJumper(name);
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }
    const pressItem = (data) => {
        props.navigation.navigate("Calculate", { data });
    }
    const renderItem = ({ item, index }) => (
        item?.key == 1 ?
            <View key={item} style={[styles.jumperItem, styles.addJumperItem]} >
                <TextInput
                    value={jumperName}
                    onChangeText={setJumperName}
                    style={{ flex: 1, margin: 0, padding: 0, fontSize: 20 }}
                    placeholder={"Add jumper"}
                />
                <TouchableOpacity onPress={addJumper}>
                    <Icon name={'add'} color={BaseColor.blackColor} size={28} />
                </TouchableOpacity>
            </View>
            :
            <TouchableOpacity key={item} style={styles.jumperItem} onPress={() => pressItem(item)}>
                <Text title3 blackColor style={{ flex: 2, textAlign: "center" }}>{item.name} </Text>
                <Text title3 blackColor style={{ flex: 2, textAlign: "center" }}> {item.height > 0 && `${item.height} m`} </Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => deleteJumper(item.key)}>
                    <Icon name={'delete'} color={BaseColor.blackColor} size={28} />
                </TouchableOpacity>
            </TouchableOpacity>
    )
    return (
        <View>
            <LoadingHeader />
            <FlatList
                data={[{ key: 1 }, ...jumpers]}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    )
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(Jumpers);
const styles = StyleSheet.create({
    jumperItem: {
        backgroundColor: BaseColor.whiteColor,
        padding: 12,
        borderBottomColor: BaseColor.grayColor,
        borderBottomWidth: .4,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    addJumperItem: {
        marginBottom: 25,
    }
})