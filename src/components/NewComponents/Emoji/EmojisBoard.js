// 3 thư viện nên cài để sử dụng Emoji Board
//https://www.npmjs.com/package/react-native-scrollable-tab-view
//https://www.npmjs.com/package/emoji-datasource
//https://www.npmjs.com/package/react-native-vector-icons#icon-component

import React, { useState, useEffect } from "react";
import { Animated, StyleSheet, Dimensions, View } from "react-native";
import emojiSource from "emoji-datasource";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  isIphoneXorAbove,
  isAndroid,
  handleDefaultEmoji,
  handleCustomEmoji,
} from "./HandleBoard";
import CategoryTabBar from "./CatTabbar";
import CategoryView from "./CatView";
import { defaultProps, IconType } from "./Icon";
var ScrollableTabView = require("react-native-scrollable-tab-view");

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EAEBEF",
    width: width,
    position: "absolute",
    overflow: "visible",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: isIphoneXorAbove() ? 15 : 5,
  },
});

const EmojiBoard = ({
  showBoard = false,
  customEmoji = [],
  categories = defaultProps.categories,
  blackList = defaultProps.blackList,
  numRows = isIphoneXorAbove() ? 7 : 6,
  numCols = 6,
  emojiSize = 30,
  onClick,
  onRemove,
  tabBarPosition = "top",
  hideBackSpace = false,
  categoryDefautColor = "#aaa",
  categoryHighlightColor = "#000",
  categoryIconSize = 25,
  containerStyle = {},
  tabBarStyle = {},
  labelStyle = {},
}) => {
  // emoji board height only for android
  const containerHeight = numCols * 40 + 40 + 40;
  const animationOffset = containerHeight + 50;

  const [emojiData, setEmojiData] = useState(null);
  useEffect(() => {
    let data;
    if (customEmoji.length) {
      data = handleCustomEmoji(customEmoji, blackList);
    } else {
      data = handleDefaultEmoji(emojiSource, blackList);
    }
    setEmojiData(Object.assign({}, data));
  }, []);

  const [position] = useState(
    new Animated.Value(showBoard ? 200 : -animationOffset)
  );
  useEffect(() => {
    if (showBoard) {
      Animated.timing(position, {
        duration: 500,
        toValue: -20,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(position, {
        duration: 500,
        toValue: -animationOffset,
        useNativeDriver: false,
      }).start();
    }
  }, [showBoard, position, animationOffset]);

  if (!emojiData) {
    return null;
  }
  let groupsView = [];
  _.each(categories, (category, key) => {
    const { name } = category;
    groupsView.push(
      <CategoryView
        category={name}
        emojis={emojiData[name] || []}
        numRows={numRows}
        numCols={numCols}
        emojiSize={emojiSize}
        key={name}
        tabLabel={name}
        labelStyle={labelStyle}
        onClick={onClick}
      />
    );
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: position,
          height: isAndroid() ? width / 1.3 : "auto",
        },
        containerStyle,
      ]}
    >
      <ScrollableTabView
        tabBarPosition={tabBarPosition}
        renderTabBar={() => (
          <CategoryTabBar
            categories={categories}
            onRemove={onRemove}
            hideBackSpace={hideBackSpace}
            tabBarStyle={tabBarStyle}
            categoryDefautColor={categoryDefautColor}
            categoryHighlightColor={categoryHighlightColor}
            categoryIconSize={categoryIconSize}
          />
        )}
      >
        {groupsView}
      </ScrollableTabView>
    </Animated.View>
  );
};

EmojiBoard.propTypes = {
  showBoard: PropTypes.bool,
  customEmoji: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      img: PropTypes.string,
      name: PropTypes.string,
      category: PropTypes.string,
      sort_order: PropTypes.number,
      skins: PropTypes.array,
    })
  ),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      iconType: PropTypes.oneOf([IconType.material, IconType.fontAwesome]),
      icon: PropTypes.string,
    })
  ),
  blackList: PropTypes.array,
  numRows: PropTypes.number,
  numCols: PropTypes.number,
  emojiSize: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  tabBarPosition: PropTypes.string,
  hideBackSpace: PropTypes.bool,
  categoryDefautColor: PropTypes.string,
  categoryHighlightColor: PropTypes.string,
  categoryIconSize: PropTypes.number,
  containerStyle: PropTypes.object,
  tabBarStyle: PropTypes.object,
  labelStyle: PropTypes.object,
};

export default EmojiBoard;
