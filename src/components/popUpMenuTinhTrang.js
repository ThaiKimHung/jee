import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import Menu, { MenuItem, Position } from "react-native-enhanced-popup-menu";
import { TouchableOpacity } from "react-native-gesture-handler";
import Utils from "../app/Utils";
import { Images } from "../images";
import { colors, nstyles } from "../styles";

const PopUpMenu = (props) => {
    Utils.nlog('ds duyet', props.data);
    let textRef = null//React.createRef();
    let menuRef = null;

    const [greeting, setGreeting] = useState(
        props.data[0].name
    );

    const setMenuRef = ref => menuRef = ref;
    const itemPress = (item) => {
        Utils.nlog('getDSNghiphep', item);
        setGreeting(item.name)
        props.onItemvalue(item.value);
        hideMenu();
    }


    const hideMenu = () => menuRef.hide();
    const showMenu = () => menuRef.show(textRef, stickTo = Position.BOTTOM_LEFT);

    const onPress = () => showMenu();

    return (
        <View style={{ flex: 1, flexDirection: 'column', }}>
            <Text  style={[nstyles.ntext, { color: colors.BackText, marginTop: 15, marginHorizontal: 15, }]}
                ref={ref => textRef = ref}>
                {'Chọn tình trạng'}
            </Text>

            <TouchableOpacity style={{ flexDirection: 'row', }}
                onPress={onPress}>
                <View style={[nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }]}>
                    <Text  style={{ marginLeft: 15 }} >{greeting}</Text>
                    <Image
                        source={Images.icDropPopUp}
                        style={[nstyles.nIcon10]}
                        resizeMode={'cover'}></Image>
                </View>
            </TouchableOpacity>


            <Menu
                ref={setMenuRef}>
                <FlatList

                    data={props.data}
                    renderItem={({ item }) => <MenuItem onPress={() => itemPress(item)} >{item.name}</MenuItem>

                    } keyExtractor={(item, index2) => index2.toString()} />


            </Menu>
        </View>
    );
};



export default PopUpMenu;