import React from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import FastImage from "react-native-fast-image";

const styles = StyleSheet.create({
  emojiTouch: {
    marginTop: 10,
    height: 40,
    justifyContent: "center",
    flexDirection: "row",
  },
  emoji: {
    textAlign: "center",
  },
  emojiImg: {
    alignSelf: "center",
    resizeMode: "cover",
  },
});

const EmojiIcon = ({
  emoji,
  clickEmoji,
  longPressEmoji,
  emojiWidth,
  emojiSize,
}) => {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false; // Tắt chế độ cho phép Scaling
  const { code, img } = emoji;
  return (
    <TouchableOpacity
      style={[styles.emojiTouch, { width: emojiWidth }]}
      onLongPress={() => (longPressEmoji ? longPressEmoji(emoji) : null)}
      onPress={() => clickEmoji(emoji)}
    >
      {code ? (
        <Text style={[styles.emoji, { fontSize: emojiSize }]}>{code}</Text>
      ) : (
        <FastImage
          source={{ uri: img, priority: FastImage.priority.high }}
          style={[styles.emojiImg, { width: emojiSize, height: emojiSize }]}
        />
      )}
    </TouchableOpacity>
  );
};

EmojiIcon.propTypes = {
  emoji: PropTypes.object,
  clickEmoji: PropTypes.func,
  longPressEmoji: PropTypes.func,
  emojiWidth: PropTypes.number,
  emojiSize: PropTypes.number,
};
export default EmojiIcon;
