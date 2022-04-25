import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import { Images } from '../../images'
import { nstyles } from '../../styles/styles'

const RadioButton = (props) => {
    const { listData, style, horizontal = false, onPress } = props

    const [indexActive, setIndexActive] = useState(0)

    const onChangeValue = (item, index) => {
        setIndexActive(index)
        onPress(item.value)
    }
    const renderItem = ({ item, index }) => {
        const active = index == indexActive
        return (
            <TouchableOpacity onPress={() => onChangeValue(item, index)} style={styles.btnItem} activeOpacity={0.5}>
                <Image source={active ? Images.ImageJee.icCHDaDat : Images.ImageJee.icCHRong} style={[nstyles.nIcon20, styles.icon]}></Image>
                <Text style={{ width: '80%' }}>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={[styles.container, style]}>
            <FlatList
                data={listData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal={horizontal}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
    },
    btnItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    icon: {
        marginRight: 5
    }
})
export default RadioButton