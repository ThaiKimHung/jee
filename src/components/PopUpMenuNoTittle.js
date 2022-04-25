import React from "react";
import { FlatList, Text, View } from "react-native";
import Menu, { MenuItem, Position } from "react-native-enhanced-popup-menu";
import { TouchableOpacity } from "react-native-gesture-handler";
import Utils from "../app/Utils";

const PopUpMenuNoTittle = (props) => {
    Utils.nlog('ds duyet', props.data);
    let textRef = null;// React.createRef();
    let menuRef = null;

    // const [selectTitle, setselectTitle] = useState(
    //     props.Select ? props.Select.name : "Menu"
    // );

    var { onItemvalue = () => { } } = props;
    Utils.nlog(props.Select)
    // setGreeting(Select);
    const setMenuRef = ref => menuRef = ref;
    const itemPress = (item) => {
        Utils.nlog('getDSNghiphep', item);
        onItemvalue(item);
        hideMenu();
    }
    const hideMenu = () => menuRef.hide();
    const showMenu = () => menuRef.show(textRef, stickTo = Position.BOTTOM_LEFT);
    const onPress = () => showMenu();
    return (
        <View style={{ flexDirection: 'column', }}>
            <TouchableOpacity
                style={{ flexDirection: 'row', }}
                onPress={onPress}>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <Text  ref={ref => textRef = ref}></Text>

                    {props.ViewSelected(props.Select ? props.Select.name : "menu")}
                </View>
            </TouchableOpacity>
            <Menu
                ref={setMenuRef}>
                <FlatList
                    data={props.data}
                    renderItem={({ item }) => <MenuItem onPress={() => itemPress(item)}>
                        {props.ViewItem(item)}
                    </MenuItem>
                    } keyExtractor={(item, index2) => index2.toString()} />
            </Menu>
        </View>
    );
};
export default PopUpMenuNoTittle;