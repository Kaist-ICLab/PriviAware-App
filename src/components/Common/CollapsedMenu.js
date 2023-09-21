import React, {useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Collapsible from 'react-native-collapsible';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colorSet} from '@constants/Colors';

function CollapsedMenu({isNew, title, children}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    Animated.timing(rotateAnimation, {
      toValue: isCollapsed ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {});
  };

  const cwRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: cwRotating,
      },
    ],
  };

  return (
    <>
      <TouchableOpacity
        style={styles.filteringInfoRow}
        onPress={async () => {
          handleAnimation();
          setIsCollapsed(() => !isCollapsed);
        }}>
        <Text> {title}</Text>
        {isNew ? (
          <View style={styles.dotButton}>
            <MaterialCommunityIcons name="plus" color="#ffffff" size={20} />
          </View>
        ) : (
          <Animated.View style={[animatedStyle, styles.dotButton]}>
            <MaterialCommunityIcons
              name="chevron-up"
              color="#ffffff"
              size={22}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
    </>
  );
}

const styles = StyleSheet.create({
  filteringInfoRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotButton: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorSet.primary,
  },
});

export default CollapsedMenu;
