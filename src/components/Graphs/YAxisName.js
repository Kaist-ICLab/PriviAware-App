import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colorSet} from '@constants/Colors';

/**
 * @param {number} textHeight - height of the text
 * @param {number} textLength - length of the text
 * @param {string} name - name of the axis
 * @param {number} fontSize - font size of the text (default is 10)
 */
export default function YAxisName({textHeight, textLength, name, fontSize}) {
  const OFFSET = textLength / 2 - textHeight / 2;

  const styles = StyleSheet.create({
    container: {
      width: textHeight,
      justifyContent: 'center',
      paddingEnd: 20,
    },
    label: {
      color: colorSet.gray,
      fontSize: fontSize ? fontSize : 10,
      transform: [{rotate: '-90deg'}, {translateY: -OFFSET}],
      width: textLength,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{name}</Text>
    </View>
  );
}
