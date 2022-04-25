import React from "react";
import { FlatList, Text, View } from "react-native";
import Menu, { MenuItem, Position } from "react-native-enhanced-popup-menu";
import { TouchableOpacity } from "react-native-gesture-handler";

const PopUp = (props) => {
    let textRef = null;// React.createRef();
    let menuRef = null;
    const setMenuRef = ref => menuRef = ref;
    const itemPress = (item) => {
        // Utils.nlog('getDSNghiphep', item);
        props.onItemvalue(item);
        hideMenu();
    }
    var { ViewTitle = () => { }, Select = '', titleselect = '' } = props;
    const hideMenu = () => menuRef.hide();
    const showMenu = () => menuRef.show(textRef, stickTo = Position.BOTTOM_LEFT);
    const onPress = () => showMenu();
    return (
        <View style={{ flexDirection: 'column', }}>

            <View style={{ flexDirection: 'row' }}>
                <Text 
                    ref={ref => textRef = ref}>
                </Text>
                {ViewTitle()}
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', }}
                onPress={onPress}>
                {props.ViewSelected(Select ? Select.name : (titleselect.length > 0 ? titleselect : "menu"))}
            </TouchableOpacity >
            <Menu
                ref={setMenuRef}>
                <FlatList
                    style={{ flex: 1 }}
                    data={props.data}
                    renderItem={({ item }) =>
                        <MenuItem onPress={() => itemPress(item)}>
                            {props.ViewItem(item)}
                        </MenuItem>
                    } keyExtractor={(item, index2) => index2.toString()} />
            </Menu>
        </View>
    );
};

export default PopUp;