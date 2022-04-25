import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Menu, { MenuItem, Position } from "react-native-enhanced-popup-menu";
import Utils from "../app/Utils";
import { Images } from "../images";
import { colors, nstyles } from "../styles";

const PopUpMenuYear = (props) => {
    Utils.nlog('get ds so phep', props.data);

    let textRef = React.createRef();
    let menuRef = null;

    const [greeting, setGreeting] = useState(
        props.data[0].Title
    );

    const setMenuRef = ref => menuRef = ref;
    const itemPress = (item) => {

        setGreeting(item.Title)
        props.onItemvalue(item.ID_Row);
        hideMenu();
    }


    const hideMenu = () => menuRef.hide();
    const showMenu = () => menuRef.show(textRef.current, stickTo = Position.BOTTOM_LEFT);

    const onPress = () => showMenu();

    return (
        <View style={{ flex: 1, flexDirection: 'column', }}>
            <Text  style={[nstyles.ntext, { color: colors.BackText, marginTop: 15, marginHorizontal: 15, }]} >
                {'Năm'}
            </Text>

            <TouchableOpacity style={{ flexDirection: 'row', }}
                onPress={onPress}>
                <View style={[nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }]}>
                    <Text  style={{ marginLeft: 15 }} ref={textRef}>{greeting}</Text>
                    <Image
                        source={Images.icDropPopUp}
                        style={[nstyles.nIcon10, { tintColor: colors.black, alignItems: 'center' }]}
                        resizeMode={'cover'}></Image>
                </View>
            </TouchableOpacity>


            <Menu
                ref={setMenuRef}
            // style={{padding: 20,}}
            >
                <FlatList

                    data={props.data}
                    renderItem={({ item }) => <MenuItem onPress={() => itemPress(item)} >{item.Title}</MenuItem>

                    } keyExtractor={(item, index2) => index2.toString()} />


            </Menu>
        </View>
    );
};



export default PopUpMenuYear;