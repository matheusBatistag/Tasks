import React, { Component } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from 'react-native'

import axios from 'axios'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = {
        ...initialState
    }

    signinOrSignup = () => {
        if(this.state.stageNew) {
            this.signup()
        }else {
           this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            showSuccess('Usuário cadastrado!')
            this.setState({ ...initialState })
        } catch(e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password,
            })

            axios.defaults.headers.commom['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home')
        } catch(e) {
            showError(e)
        }
    }

    render() {
        return (
           <ImageBackground source={backgroundImage}
               style={styles.background}>
               <Text style={styles.title}>Tasks</Text>
               <View style={styles.formContainer}>
                   <Text style={styles.subtitle}>
                       {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'}
                   </Text>
                   {this.state.stageNew && 
                       <AuthInput icon='user' placeholder='Nome'
                          value={this.state.name}
                          style={styles.input}
                          onChangeText={name => this.setState({ name })}/>
                   }
                   <AuthInput icon='at' placeholder='E-mail'
                     value={this.state.email}
                     style={styles.input}
                     onChangeText={email => this.setState({ email })}/>
                   <AuthInput icon='lock' placeholder='Senha'
                     value={this.state.password}
                     style={styles.input} secureTextEntry={true}
                     onChangeText={password => this.setState({ password })}/>
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk'
                          placeholder='Confirmação de Senha'
                          value={this.state.confirmPassword}
                          style={styles.input} secureTextEntry={true}
                          onChangeText={confirmPassword => this.setState({ confirmPassword })}/> 
                    }
                     <TouchableOpacity onPress={this.signinOrSignup}>
                         <View style={styles.button}>
                             <Text style={styles.buttonText}>
                                 {this.state.stageNew ? 'Registrar' : 'Entrar'}
                             </Text>
                         </View>
                         <TouchableOpacity style={{ padding: 10 }}
                            onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                            <Text style={styles.subtitle}>
                               {this.state.stageNew ? 'Já possui conta?' : 'Ainda não passui conta?'}
                            </Text>
                         </TouchableOpacity>
                     </TouchableOpacity>
               </View>
           </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
       fontFamily: commonStyles.fontFamily,
       color: commonStyles.colors.secondary,
       fontSize: 70,
       marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10 
    },
    formContainer: {
       backgroundColor: 'rgba(0, 0, 0, 0.8)',
       padding: 20,
       width: '90%'
    },
    input: {
       marginTop: 10,
       backgroundColor: '#FFF',
       flexDirection: 'row'
    },
    button: {
       backgroundColor: '#080',
       marginTop: 10,
       padding: 10,
       alignItems: 'center',
       borderRadius: 7
    },
    buttonText: {
       fontFamily: commonStyles.fontFamily,
       color: '#FFF',
       fontSize: 20,
    }
})