import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Slider from 'rn-range-slider';
import Label from "./Label";
import Notch from "./Notch";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";

export default function index(props) {

    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback(value => <Label text={value} />, []);
    const renderNotch = useCallback(() => <Notch />, []);

    return (
        <View style={[styles.root, props.style]}>
            <Slider
                style={styles.slider}
                min={props.min}
                max={props.max}
                low={props.low}
                high={props.high}
                step={props.step || 1}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={props.handleValueChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        width: "100%"
    }
})
