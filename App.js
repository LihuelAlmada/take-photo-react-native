import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";


export default function App() {
  //Hooks
  const cameraRef = useRef(null)
  const [autoFocus, setAutoFocus] = useState(Camera.Constants.AutoFocus.singleShot);
  const [whiteBalance, setWhiteBalance] = useState(Camera.Constants.WhiteBalance.fluorescent);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturePhoto, setCapturePhoto] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted')
    })();
  }, []);
  //funtions
  async function takePicture(){
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync();
      setCapturePhoto(data.uri);
      setOpen(true);
      console.log(data);
    }
  }

  async function sendData(){
    //agregar post a servicio
    alert("Se envio la informacion exitosamente, espere unos segundos para recibir la informacion");
  }
  //return
  if(hasPermission === null){
    return <View/>;
  }
  if(hasPermission === false){
    return <Text>Aceso denegado! acepte los permisos para la camara</Text>;
  }
  if(hasPermission === true){
    return (
      <SafeAreaView style={styles.container}>
        <Camera 
          style={{ flex: 1 }}
          type={type}
          ref={cameraRef}
          autoFocus={autoFocus}
          whiteBalance={whiteBalance}
        >
          <View style={styles.viewCamera}>
            <TouchableOpacity style={styles.touchableCamera}
              onPress={ () => {
                setType (
                  type === Camera.Constants.Type.back ?
                  Camera.Constants.Type.front :
                  Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.changeCamera}> Cambiar camara</Text>
            </TouchableOpacity>
          </View>
        </Camera>
        <TouchableOpacity style={styles.button}
          onPress={ takePicture}
        >
              <FontAwesome name="camera" style={styles.icon}/>
        </TouchableOpacity>
        <StatusBar style="auto" />

        { capturePhoto &&
          <Modal
            animationType="slide"
            transparent={false}
            visible={open}
          >
            <View style={styles.modalView}>
              <Image
                style={styles.imageModal}
                source={{uri: capturePhoto}}
              />
              <View style={styles.containerButtons}>
                <TouchableOpacity 
                  style={{ margin: 10}}
                  onPress={ ()=> setOpen(false)}
                >
                  <FontAwesome name="window-close" style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ margin: 10}}
                  onPress={ sendData}
                >
                  <FontAwesome name="upload" style={styles.icon}/>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
  },
  viewCamera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  touchableCamera: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  changeCamera: {
    fontSize: 20,
    margin: 13,
    color: '#fff',
  },
  button: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
  modalView: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  icon:{
    fontSize: 30,
    color: "#FFF",
  },
  imageModal: { 
    flex: 11,
    width: '100%',
    height: 300,
    borderRadius: 20
  },
  containerButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-around',
    width: '100%',
  }
});
