import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Label = ({ text, ...restProps }) => {

  const sec2str = (t) => {
    const mins = parseInt(t / 60);
    const secs = parseInt(t % 60);
    return `${mins < 10 ? "0" : ''}${mins} : ${secs < 10 ? "0" : ''}${secs}`;
  }

  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{sec2str(text)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#4499ff',
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});

export default memo(Label);