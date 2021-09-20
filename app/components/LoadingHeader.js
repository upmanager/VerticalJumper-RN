import React from 'react';
import { View } from 'react-native';
import { LinearProgress } from 'react-native-elements';

export default (props) => {
    return props.loading ? <LinearProgress /> : <View style={{ height: 4 }} />;
}