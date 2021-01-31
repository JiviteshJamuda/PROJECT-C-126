import React from 'react'
import { Text, Button, View, Platform, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            image : null,
        }
    }

    getPermissions = async() => {
        if(Platform.OS != 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status != 'granted'){
                return alert('please grant camera permission')
            }
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData()
        let fileName = uri.split('/')[uri.split('/').length-1]
        let type = `image/${uri.split('/')[uri.split('/').length-1]}`
        const fileToUpload = {
            uri : uri,
            name : fileName,
            type : type,
        }
        data.append('alphabet', fileToUpload)
        fetch('https://6ad83c971d15.ngrok.io/predict_alphabet', {
            method : 'POST',
            body : data,
            headers : {
                'content-type' : 'multipart/form-data',
            }
        })
        .then((response)=>{
            response.json()
        })
        .then((result)=>{
            console.log('success : ', result)
        })
        .catch((error)=>{
            console.error(error)
        })
    }

    pickImage = async() => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.All,
                allowsEditing : true,
                aspect : [4,3],
                quality : 1,
            })
            if(!result.cancelled){
                this.setState({
                    image : result.data
                })
                this.uploadImage(result.uri)
            }
        } catch (error) {
            console.error(error)
        }
    }

    componentDidMount(){
        this.getPermissions()
    }

    render(){
        var image = this.state.image
        return(
            <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Button title='Pick Image' onPress = {this.pickImage}/>
            </View>
        )
    }

}