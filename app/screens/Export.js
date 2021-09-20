import * as reduxActions from "@actions";
import { LoadingHeader, Text } from "@components";
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Overlay, Switch } from "react-native-elements";
import RNFS from "react-native-fs";
import Toast from "react-native-simple-toast";
import { connect } from 'react-redux';
import XLSX from "xlsx";

const Jumpers = (props) => {
    const { jumpers } = props.app;
    const [exportOptions, setExportOptions] = useState({});
    useEffect(() => {
    }, []);
    const EXPORTTYPE = {
        XLSX: "xlsx",
        CSV: "csv",
        HTML: "html",
    }
    const getNum = (_v) => {
        return parseInt(_v * 100) / 100;
    }
    // const height = getNum(getHeight() * (isCM ? 2.54 : 1));
    // BookType = 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'xla' | 'biff8' | 'biff5' | 'biff2' | 'xlml' | 'ods' | 'fods' | 'csv' | 'txt' | 'sylk' | 'html' | 'dif' | 'rtf' | 'prn' | 'eth';
    const exportData = (bookType) => {
        let data_to_export = jumpers;
        if (exportOptions.valid_height == true) {
            data_to_export = data_to_export.filter(item => item.height > 0);
        }
        data_to_export = data_to_export.map(item => ({ Jumper: item.name, Height: getNum(item.height / (exportOptions.unit_cm ? 1 : 2.54)) || '' }));
        if (data_to_export.length <= 0) {
            Toast.showWithGravity(`No data to export`, Toast.LONG, Toast.TOP);
            return;
        }
        updateOption();

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(data_to_export)
        XLSX.utils.book_append_sheet(wb, ws, "Users")
        const wbout = XLSX.write(wb, { type: 'binary', bookType });
        const filename = `${RNFS.DownloadDirectoryPath}/Jumper_${moment().format("YMDhms")}.${bookType}`;

        RNFS.writeFile(filename, wbout).then((r) => {
            Toast.showWithGravity(`Successfully Saved to ${filename}`, Toast.LONG, Toast.TOP);
        }).catch((e) => {
            Toast.showWithGravity(`Something went wrong to export pdf.`, Toast.LONG, Toast.TOP);
            console.log('Error', e);
        });
    }
    const renderItem = ({ item, index }) => (
        <View key={item.key} style={styles.flexrow}>
            <View style={styles.jumperCell}>
                <Text title3 blackColor>{item.key == 0 ? "Jumper" : item.name} </Text>
            </View>
            <View style={styles.jumperCell}>
                <Text title3 blackColor>{item.key == 0 ? `Height (${exportOptions.unit_cm ? "cm" : "inch"})` : getNum(item.height / (exportOptions.unit_cm ? 1 : 2.54))} </Text>
            </View>
        </View>
    )
    const updateOption = (item) => {
        if (!item) return setExportOptions({});
        setExportOptions({
            ...exportOptions,
            ...item
        })
    }
    return (
        <View style={{ margin: 10, backgroundColor: "#fff", flex: 1 }}>
            <LoadingHeader />
            <Button buttonStyle={{ marginHorizontal: 30, marginVertical: 20 }} title={`Change unit to ${exportOptions.unit_cm ? 'inch' : 'cm'}`} onPress={() => updateOption({ unit_cm: !exportOptions.unit_cm })} />
            <FlatList
                data={[{ key: 0 }, ...jumpers]}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
            />
            <Button title={"Export Data"} buttonStyle={{ margin: 20 }} onPress={() => updateOption({ visible: true })} />
            <Overlay animationType={'fade'} visible={exportOptions.visible == true} overlayStyle={styles.overlayContainer} onBackdropPress={() => updateOption()}>
                <Text title3 blackColor flexCenter bold style={styles.optionsTitle}>Export Options</Text>
                <TouchableOpacity style={styles.btnClose} onPress={() => updateOption()}>
                    <Icon name={'close'} size={28} type={"font-awesome"} />
                </TouchableOpacity>
                <View style={styles.flexrow}>
                    <Text subhead blackColor style={{ flex: 1 }}>Exist height only  </Text>
                    <Switch value={exportOptions.valid_height} onValueChange={valid_height => updateOption({ valid_height })} />
                </View>
                <View style={styles.flexrow}>
                    <Text subhead blackColor style={{ flex: 1 }}>Height to cm</Text>
                    <Switch value={exportOptions.unit_cm} onValueChange={unit_cm => updateOption({ unit_cm })} />
                </View>
                <View style={[styles.flexrow, { marginTop: 20 }]}>
                    <Button title={"xlsx"} containerStyle={styles.exportAction} onPress={() => exportData(EXPORTTYPE.XLSX)} />
                    <Button title={"csv"} containerStyle={styles.exportAction} onPress={() => exportData(EXPORTTYPE.CSV)} />
                    <Button title={"html"} containerStyle={styles.exportAction} onPress={() => exportData(EXPORTTYPE.HTML)} />
                </View>
            </Overlay>
        </View>
    )
}

const mapStateToProps = (state) => (state)
const mapDispatchToProps = { ...reduxActions }
export default connect(mapStateToProps, mapDispatchToProps)(Jumpers);
const styles = StyleSheet.create({
    flexrow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    jumperCell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    overlayContainer: {
        width: "60%",
        padding: 15
    },
    optionsTitle: {
        marginBottom: 15,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    exportAction: {
        flex: 1,
        margin: 4
    },
    btnClose: {
        position: "absolute",
        top: -15,
        right: -15,
        backgroundColor: "#fff",
        borderRadius: 99,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center"
    }
})