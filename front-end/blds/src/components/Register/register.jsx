import React, { Component } from 'react'
import { Modal, Button, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './register.css'

const backendURL = `http://${process.env.REACT_APP_BACK_END_HOST}:${process.env.REACT_APP_BACK_END_PORT}${process.env.REACT_APP_BACK_END_ROUTE}`

export default class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: undefined,
            email: undefined,
            password: undefined,

            visible: this.props.visible,
            loading: false,
        }
    }

    componentWillReceiveProps({visible}) {
      this.setState({...this.state, visible})
    }

    register = async () => {
        if(!(this.state.name?.length && this.state.email?.length && this.state.password?.length)){
            message.error('Complete the form')
            return;
        }
        if (!/(?=^.{8,128}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(this.state.password)) {
            message.error('Weak password, must contain at least: 8 characters, one uppercase and lowercase, one number and one special character')
            return
        }

        this.setState({ loading: true })     
        
        try{
            const response = await fetch(`${backendURL}/user/public/create`, {
                method: "POST",
                headers: {                
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
                }),
                
            })                            

            if (response.status === 200) {            
                this.props.selfClose()
                message.success('Registration successfull')
            } else {            
                message.error('Registration failure, try again with another credentials');
            }
        }catch(e){
            message.error('Registration failure, try again later');
        }

      this.setState({loading: false})
    }



    render() {

        const registerModal = (
            <Modal className="modalRegister"
                title="Register"
                width={310}                
                centered={true}
                visible={this.state.visible}
                closable={true}
                onCancel={() => {
                  this.setState({
                    name: undefined,
                    email: undefined,
                    password: undefined,

                    visible: false,
                    loading: false,
                  })
                }, () => this.props.selfClose() }
                footer={[
                    <div className="modalRegisterFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button className="modalRegisterButtonRegister"
                            //style={{ backgroundColor: '#fff', borderColor: '#333', color: '#333' }}
                            loading={this.state.loading}
                            onClick={() => this.register()}                            
                        >
                            Register
                        </Button>                        
                    </div>
                ]}
            >
                <div className="modalRegisterBody">
                    <Input size="large" placeholder="Name" prefix={<UserOutlined />}
                        value={this.state.name}
                        onChange={(value) => this.setState({ name: value.target.value })}
                    />
                    <Input size="large" placeholder="Email" prefix={<UserOutlined />}
                        value={this.state.email}
                        onChange={(value) => this.setState({ email: value.target.value })}
                    />
                    <Input.Password size="large" placeholder="Password"
                        value={this.state.password}
                        onChange={(value) => this.setState({ password: value.target.value })}
                    />
                </div>
            </Modal>
        )

        return (
            <div id="modalRegister">
                {registerModal}
            </div>
        )
    }
}