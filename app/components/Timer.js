import React, { useState, useEffect } from 'react'
import { Text } from "@components";
import { View, StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default function Timer(props) {
    const [currentSeconds, setcurrentSeconds] = useState(0);
    let curTime = 0;
    useEffect(() => {
        if (!props.isPlaying) {
            setcurrentSeconds(0);
            return;
        }
        const interval = setInterval(() => {
            curTime += 1;
            setcurrentSeconds(curTime);
        }, 1000);
        return () => {
            clearInterval(interval);
            curTime = currentSeconds;
        }
    }, [props.isPlaying]);
    const sec2str = () => {
        const mins = parseInt(currentSeconds / 60);
        const secs = parseInt(currentSeconds % 60);
        return `${mins < 10 ? "0" : ''}${mins} : ${secs < 10 ? "0" : ''}${secs}`;
    }
    return (
        <View style={styles.container}>
            <View style={[styles.badge, props.isPlaying && styles.active]} />
            <Text whiteColor headline>{sec2str()}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: BaseColor.blackOpactityColor,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8
    },
    badge: {
        width: 15,
        height: 15,
        backgroundColor: BaseColor.grayColor,
        borderRadius: 999,
        marginRight: 10
    },
    active: {
        backgroundColor: BaseColor.redColor
    }
})
