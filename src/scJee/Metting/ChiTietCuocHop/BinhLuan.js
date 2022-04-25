import React, { Component, createRef } from 'react';
import { View } from "react-native";
import Modal_BinhLuan from '../../Social/ModalSocial/Modal_BinhLuan';
import { getIdTopic } from '../../../apis/JeePlatform/API_JeeMeeting/apiBinhLuan'
import LottieView from 'lottie-react-native';
import { colors } from '../../../styles';
import { Height, nstyles, Width } from '../../../styles/styles';
import IsLoading from '../../../components/IsLoading';

export class BinhLuan extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.rowid = this.props.rowid
        this.state = {
            topicId: '',
        }
    }

    componentDidMount = () => {
        this.loading.show()
        this._loadTopPicId()
    }

    _loadTopPicId = async () => {
        let res = await getIdTopic(this.rowid)
        if (res.status == 1) {
            this.setState({ topicId: res.data?.topicObjectID })
        }
        this.loading.hide()
    }

    render() {
        return (
            <View style={[nstyles.ncontainer, { marginTop: 5 }]}>
                {this.state.topicId != '' ?
                    <Modal_BinhLuan topicId={this.state.topicId} nthis={this.nthis} ></Modal_BinhLuan>
                    : null
                }
                <IsLoading ref={ref => this.loading = ref}></IsLoading>
            </View>
        )
    }
}

export default BinhLuan
