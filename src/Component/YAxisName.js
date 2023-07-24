import React from 'react';
import {View, Text} from 'react-native';
import {colorSet} from '../constants/Colors';

function YAxisName({textHeight, textLength, name, fontSize}) {
  const OFFSET = textLength / 2 - textHeight / 2;

  return (
    <View
      style={{
        width: textHeight,
        justifyContent: 'center',
        paddingEnd: 20,
      }}>
      <Text
        style={{
          color: colorSet.gray,
          fontSize: fontSize ? fontSize : 10,
          transform: [{rotate: '-90deg'}, {translateY: -OFFSET}],
          width: textLength,
        }}>
        {name}
      </Text>
    </View>
  );
}

export default YAxisName;
