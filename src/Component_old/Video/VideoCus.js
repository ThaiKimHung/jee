import React, { Component, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import Utils from '../../app/Utils';
import { colors } from '../../styles';
const VideoCus = React.forwardRef((props, ref) => {
  const [loading, setloading] = useState(true)
  return (
    <View style={{ ...props.style }}>
      <Video
        onLoadStart={e => {
          // Utils.nlog('giá tị onload <<>><<<<<>><<<<>>><<<<<<>', e);
        }}
        ref={ref}
        onReadyForDisplay={e => {
          setloading(false)
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 5
        }}
        // resizeMode="cover"
        paused={true}
        {...props}
      />
      {loading == true ? (
        <View
          style={{
            backgroundColor: colors.backgroundModal,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10
          }}
        >
          <ActivityIndicator size="large" color={colors.colorTextSelect} />
        </View>
      ) : null}
    </View>
  );

})

export default VideoCus;
