import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
    Alert
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Utils from '../../app/Utils';
import { Images } from '../../images';
import { Height, Width } from '../../styles/styles';
import Render_ImagesComment from '../Render_ImagesComment';
import UtilsApp from "../../app/UtilsApp";
import { colors } from '../../styles';

/*this is a react native version of this code https://github.com/Expertizo/react-fb-image-grid*/

export default class FbImages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countFrom: 5,
            conditionalRender: false,
            imageOnPress: this.props.imageOnPress ? this.props.imageOnPress : () => { }
        };
        this.nthis = this.props.nthis
    }

    clickEventListener = () => {
        // Alert.alert('Alert', 'image clicked');
        UtilsApp.showImageZoomViewer(this.nthis, this.props.images)
    }



    renderOne() {
        const { countFrom } = this.state;
        return (
            <View style={{ backgroundColor: colors.black_20_2, borderRadius: 20, marginLeft: 10 }}>
                <TouchableOpacity style={[styles.imageContent1]} onPress={() => { this.clickEventListener() }}>
                    <Render_ImagesComment
                        oneImg={true}
                        ImageNetWork={this.props.images[0]}
                        // defaultImage={null}
                        defaultImage={Images.ImageJee.ic_Loading}
                        styImages={styles.image1}
                        resizeModeFastImage={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderOne1() {
        const { countFrom } = this.state;
        return (
            <View>
                <TouchableOpacity style={[styles.imageContent11]} onPress={() => { this.clickEventListener() }}>

                    <Render_ImagesComment
                        ImageNetWork={this.props.images[0]}
                        // defaultImage={null}
                        defaultImage={Images.ImageJee.ic_Loading}
                        styImages={styles.image}
                        resizeModeFastImage={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderTwo() {
        const { countFrom } = this.state;
        const conditionalRender = [3, 4].includes(this.props.images.length) || this.props.images.length > +countFrom && [3, 4].includes(+countFrom);

        return (
            <View style={[styles.row]}>
                <TouchableOpacity style={[styles.imageContent2, { paddingRight: 5 }]} onPress={() => { this.clickEventListener() }}>
                    {/* <Image style={styles.image} source={{ uri: (conditionalRender) ? images[1] : images[0] }} /> */}
                    <Render_ImagesComment
                        ImageNetWork={(conditionalRender) ? this.props.images[1] : this.props.images[0]}
                        // defaultImage={null}
                        defaultImage={Images.ImageJee.ic_Loading}
                        styImages={styles.image}
                        resizeModeFastImage={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.imageContent2]} onPress={() => { this.clickEventListener() }}>
                    <Render_ImagesComment
                        ImageNetWork={(conditionalRender) ? this.props.images[2] : this.props.images[1]}
                        // defaultImage={null}
                        defaultImage={Images.ImageJee.ic_Loading}
                        styImages={styles.image}
                        resizeModeFastImage={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderThree() {
        const { countFrom } = this.state;
        const overlay = !countFrom || countFrom > 5 || this.props.images.length > countFrom && [4, 5].includes(+countFrom) ? this.renderCountOverlay(true) : this.renderOverlay();
        const conditionalRender = this.props.images.length == 4 || this.props.images.length > +countFrom && +countFrom == 4;

        return (
            <View style={styles.row}>
                <TouchableOpacity style={[styles.imageContent3, { paddingRight: 5 }]} onPress={() => { this.clickEventListener() }}>
                    <Render_ImagesComment
                        ImageNetWork={(conditionalRender) ? this.props.images[1] : this.props.images[2]}
                        // defaultImage={null}
                        defaultImage={Images.ImageJee.ic_Loading}
                        styImages={styles.image}
                        resizeModeFastImage={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.imageContent3, { paddingRight: 5 }]} onPress={() => { this.clickEventListener() }}>
                    <Render_ImagesComment
                        ImageNetWork={(conditionalRender) ? this.props.images[2] : this.props.images[3]}
                        // defaultImage={null}
                        defaultImage={Images.ImageJee.ic_Loading}
                        styImages={styles.image}
                        resizeModeFastImage={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
                { overlay}
            </View >
        );
    }

    renderOverlay() {
        return (
            <TouchableOpacity style={[styles.imageContent3, { paddingRight: 5 }]} onPress={() => { this.clickEventListener() }}>
                <Render_ImagesComment
                    ImageNetWork={this.props.images[this.props.images.length - 1]}
                    // defaultImage={null}
                    defaultImage={Images.ImageJee.ic_Loading}
                    styImages={styles.image}
                    resizeModeFastImage={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>
        );
    }

    renderCountOverlay(more) {
        const { countFrom } = this.state;
        const extra = this.props.images.length - (countFrom && countFrom > 5 ? 5 : countFrom);
        const conditionalRender = this.props.images.length == 4 || this.props.images.length > +countFrom && +countFrom == 4;
        return (
            <TouchableOpacity style={[styles.imageContent3, { paddingRight: 5 }]} onPress={() => { this.clickEventListener() }}>
                <Render_ImagesComment
                    ImageNetWork={(conditionalRender) ? this.props.images[3] : this.props.images[4]}
                    // defaultImage={null}
                    defaultImage={Images.ImageJee.ic_Loading}
                    styImages={styles.image}
                    resizeModeFastImage={FastImage.resizeMode.cover}
                />
                <View style={styles.overlayContent}>
                    <View>
                        <Text style={styles.count}>+{extra}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { modal, index, countFrom } = this.state;
        const imagesToShow = [...this.props.images];

        if (countFrom && this.props.images.length > countFrom) {
            imagesToShow.length = countFrom;
        }

        return (
            <View style={styles.container}>
                { imagesToShow.length >= 2 ? (
                    <>
                        {[1, 3, 4].includes(imagesToShow.length) && this.renderOne1()}
                        {imagesToShow.length >= 2 && imagesToShow.length != 4 && this.renderTwo()}
                        {imagesToShow.length >= 4 && this.renderThree()}
                    </>
                ) : (
                        <>
                            {[1, 3, 4].includes(imagesToShow.length) && this.renderOne()}
                        </>
                    )}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginVertical: 20,
        // backgroundColor: colors.redFresh
    },
    row: {
        flexDirection: 'row',
        backgroundColor: colors.black_20_2,
        marginLeft: 10
    },

    imageContentFirst: {
        flex: 1
    },
    imageContent1: {
        height: Height(16),
        width: '100%'
        // justifyContent: 'center',
        // alignItems: 'center'
        // backgroundColor: colors.black_20
    },
    imageContent11: {
        height: Height(20),
        width: '100%',
        marginLeft: 10,
        marginBottom: 5
    },
    imageContent2: {
        height: Height(20),
        width: '50%',
    },
    imageContent3: {
        height: Height(20),
        width: '33.33%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    image1: {
        width: '60%',
        height: '100%',
    },
    //overlay efect
    overlayContent: {
        flex: 1,
        position: 'absolute',
        zIndex: 100,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    count: {
        fontSize: 50,
        color: "#ffffff",
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 139, 1)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
});