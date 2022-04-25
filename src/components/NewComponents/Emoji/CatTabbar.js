import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontIcon from "react-native-vector-icons/FontAwesome";
import { isIphoneXorAbove } from "./HandleBoard";
import { IconType } from "./Icon";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  tabs: {
    width: width,
    flexDirection: "row",
    paddingLeft: isIphoneXorAbove() ? 15 : 20,
    paddingVertical: 6,
  },
  scrollView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    flexDirection: "row",
    marginHorizontal: 13,
  },
  backsplace: {
    marginLeft: 20,
    marginRight: 20,
    paddingVertical: 6,
  },
});

const CategoryTabBar = ({
  goToPage,
  activeTab,
  tabs,
  tabBarStyle,
  categories,
  onRemove,
  hideBackSpace,
  categoryDefautColor,
  categoryHighlightColor,
  categoryIconSize,
}) => {
  // set default method for remove
  const clickRemove = () => {
    if (typeof onRemove !== "function") {
      onRemove;
    } else {
      onRemove();
    }
  };
  return (
    <View style={[styles.tabs, tabBarStyle]}>
      <ScrollView
        onResponderTerminationRequest={(env) => false}
        contentContainerStyle={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, i) => {
          const iconColor =
            activeTab === i ? categoryHighlightColor : categoryDefautColor;
          const iconObj = categories.find((item) => tab === item.name) || {};
          const { iconType, icon } = iconObj;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => goToPage(i)}
              style={styles.tab}
            >
              {iconType === IconType.material ? (
                <MaterialCommunityIcons
                  name={icon}
                  size={categoryIconSize}
                  color={iconColor}
                />
              ) : iconType === IconType.fontAwesome ? (
                <FontIcon
                  name={icon}
                  size={categoryIconSize}
                  color={iconColor}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {!hideBackSpace && (
        <TouchableOpacity
          style={styles.backsplace}
          onPress={() => clickRemove()}
        >
          <MaterialCommunityIcons
            name={"backspace-outline"}
            size={24}
            color={"#000"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CategoryTabBar;
