import React, { Component, Fragment } from 'react';
import { FlatList } from 'react-native';
import { Animated, ScrollView, TouchableOpacity, View, Text, Image } from 'react-native';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import ListEmpty from '../components/ListEmpty';
import { Images } from '../images';
import { colors, nstyles } from '../styles';
import { reSize, reText, sizes } from '../styles/size';
import HeaderModal from './HeaderModal';
import TreeView from 'react-native-final-tree-view';

class ComponentSelectTree extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });

        this.state = {
            textempty: RootLang.lang.thongbaochung.khongcodulieu,
            opacity: new Animated.Value(0),
            expanded: false,
            expandedChild: false,
            ChildrenTmp: [],
            listChildren: [],
            listChildrenTmp: [],
            _listHandleChild: [],
            _listHandleChildren: [],
            hidden: false,
            data: this.AllThaoTac,




        }
    };

    mapTree(data) {
        var list = []
        if (Array.isArray(data) && data.length > 0) {
            list = data.map((item, index) => {
                if (item.hasOwnProperty('Children')) {
                    var children = this.mapTree(item.Children)
                    return {
                        RowID: item.RowID,
                        Title: item.Title,
                        ParentID: item.ParentID,
                        Position: item.Position,
                        children: children //Gán lại data hiện tại là Chilren
                    }
                }
                else {
                    return {
                        RowID: item.RowID,
                        Title: item.Title,
                        ParentID: item.ParentID,
                        Position: item.Position,
                    }
                }
            })
        }
        else {
            return (
                list
            )
        }
        return (
            list
        )
    }

    _select = (item,) => {
        Utils.setGlobal("Select", item.RowID);
        this.callback(item);
        this._endAnimation(0)
        this._goback();

    }


    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };

    componentDidMount() {
        this._startAnimation(0.8)
    }



    render() {
        var { selected, opacity } = this.state
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{ height: nstyles.Height(50), backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1 }}>
                    <HeaderModal />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: nstyles.paddingBotX + 15 }}>
                                {
                                    this.AllThaoTac.length > 0 ? <View style={{
                                        marginLeft: 10, marginVertical: 10, backgroundColor: 'white', flex: 1
                                    }}>
                                        <TreeView
                                            data={this.mapTree(this.AllThaoTac)}
                                            initialExpanded={true}
                                            // activeOpacityNode={0.5}
                                            onNodePress={({ node, level }) => this._select(node, level)}
                                            renderNode={({ node, level }) => {
                                                return (
                                                    <View>
                                                        <Text
                                                            style={{
                                                                marginLeft: 25 * level,
                                                                fontSize: reText(16),
                                                                paddingHorizontal: 10,
                                                                color: Utils.getGlobal("Select") && Utils.getGlobal("Select") === node.RowID ? colors.textblack : colors.colorTextBTGray,
                                                                fontWeight: Utils.getGlobal("Select") && Utils.getGlobal("Select") === node.RowID ? 'bold' : 'normal',
                                                                height: 40
                                                            }}>
                                                            {node.Title}
                                                        </Text>
                                                    </View>
                                                );
                                            }}
                                        />
                                    </View> : <ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />
                                }
                            </ScrollView>
                        </View>
                        {/* <View style={{ width: Width(15) }}>
                            <GestureRecognizer onSwipeDown={this._goback} style={{ borderTopRightRadius: 20 }} onPressIcon={this._goback} />
                        </View> */}
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ComponentSelectTree, mapStateToProps, true)