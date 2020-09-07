import Login from '../Login/login'
import Cookies from 'js-cookie';
import travela_logo from '../../assets/logo/blds_travela_logo.png'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { Input, Button, List, message, Modal, DatePicker, InputNumber} from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import './home.css'
import jwt from 'jsonwebtoken';
import { PhoneOutlined, HomeOutlined, CompassOutlined, CloseCircleOutlined, IdcardOutlined, MailTwoTone, KeyOutlined } from '@ant-design/icons';
import React, { Component } from 'react'

const { RangePicker } = DatePicker;

const backendURL = `http://${process.env.REACT_APP_BACK_END_HOST}:${process.env.REACT_APP_BACK_END_PORT}${process.env.REACT_APP_BACK_END_ROUTE}`

export default class Home extends Component {

    #authToken = undefined;    
    #imgList = [];
    #originTimeOut = undefined;
    #destinationTimeOut = undefined;

    constructor(props) {
        super(props)                

        this.state = {
            apiKey: undefined,
            inputApiKey: undefined,

            user: undefined,                                    
            
            //nameForm: undefined,
            //phoneForm: undefined,
            peopleNumberForm: undefined,
            dateRangeForm: [],
            originForm: undefined,
            destinationForm: undefined,

            loadingRegister: false,

            mapsQuery: undefined,
            mapsOpacity: 0.3,

            hoveredTravel: undefined,            
        }

    }

    componentWillMount = () => {
        // Importing all images from folder
        var req = require.context("../../assets/images", false, /.*\.(jpeg|jpg|webp)$/);
        const images = {};
        req.keys().map((item, index) => { 
            this.#imgList.push(req(item))
        });
    }

    getUser = async (userId) => {
        const responseUser = await fetch(`${backendURL}/user/get/${userId}`, {
            method: "GET",
            headers: {
                'Authorization' : `Bearer ${this.#authToken}`,
                'Content-Type': 'application/json',              
            }
        })
        if(responseUser.status !== 200){
            message.error('Failed request: responseUser');
            return;
        }
        const responseJson = await responseUser.json()
        
        this.setState({
            user: responseJson.user,
        })
        message.success('Logged in successfully')
    }
   
    registerTravel = async () => {        
        const[dateFrom, dateTo] = this.state.dateRangeForm;
        console.log(dateFrom)
        console.log(dateTo)
        console.log(this.state.dateRangeForm)
        if(!(this.state.peopleNumberForm && dateFrom?.length && dateTo?.length && this.state.originForm?.length && this.state.destinationForm?.length)){
            message.error('Complete the form')
            return;
        }
        this.setState({
            loadingRegister: true
        })   
        try{
            const responseRegistration = await fetch(`${backendURL}/travel/create`, {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${this.#authToken}`,
                    'Content-Type': 'application/json',              
                },
                body: JSON.stringify({
                    userId: this.state.user.id,  
                    peopleNumber: this.state.peopleNumberForm,
                    origin: this.state.originForm,
                    destination: this.state.destinationForm,
                    dateFrom,
                    dateTo
                }),
            })
            if(responseRegistration.status !== 200){
                message.error('Failed request: registerTravel');
                this.setState({
                    loadingRegister: false
                })
                return;
            }            

            const resultRegistration = await responseRegistration.json()     
            
            const updatedTravels = [...this.state.user.travels, resultRegistration.travel]
            const updatedUser = this.state.user;
            updatedUser.travels = updatedTravels;
    
            this.setState({
                user: updatedUser,
                fieldRegisterTravel: '',
                loadingRegister: false
            })
            message.success('Registration successful')
        }catch(e){
            message.error('Failed request: registerTravel');
            this.setState({
                loadingRegister: false
            })
        }        
    }

    deleteTravel = async (deletedTravel) => {     
        try{
            const responseDelete = await fetch(`${backendURL}/travel/delete/${deletedTravel.id}`, {
                method: "DELETE",
                headers: {
                    'Authorization' : `Bearer ${this.#authToken}`,
                    'Content-Type': 'application/json',              
                }
            })
            if(responseDelete.status !== 200){
                message.error('Failed request: deleteTravel');
                return;
            }            
                 
            const updatedTravels = this.state.user.travels.filter((travel) => travel.id !== deletedTravel.id)
            const updatedUser = this.state.user;
            updatedUser.travels = updatedTravels;
            
            this.setState({
                user: updatedUser,
            })
            message.success('Remotion successful')
        }catch(e){
            message.error('Failed request: deleteTravel');
        }        
    }


    render() {   

        const loginView = (
            <Login onSuccess={(userToken) => {                
                this.#authToken = userToken   
                const token = jwt.decode(userToken);             
                this.getUser(token.id) 
            }} />
        )        

        const logoutButton = (
            <div className="logoutButton" style={{width: 100, height: 50}}>
                <Button className="buttonRegisterTravel"                    
                    loading={this.state.loadingRegister}
                    onClick={() =>  this.setState({user: undefined})}
                >
                    Logout
                </Button>
            </div>
        )

        const buttonMapsApi = (
            <div className="credentialsButton" style={{width: 300, height: 50}}>
                <Button className="buttonCredentials"                    
                    loading={this.state.loadingRegister}
                    onClick={() =>  this.setState({apiCredentialsModalVisible: true})}
                >
                    Problems to visualize the map?
                </Button>
            </div>
        )

        const apiCredentialsModal = (
            <Modal className="modalApi"
                title="Change Google Maps Credentials"
                width={450}
                style={{ top: '1%' }}
                visible={this.state.apiCredentialsModalVisible}
                closable={false}
                footer={[
                    <div className="modalApiFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button className="modalLoginButtonCancel"                            
                            onClick={() => this.setState({ apiCredentialsModalVisible: false })}
                        >
                            Cancel
                        </Button>
                        <Button className="modalApiButtonUpdate" type="primary"                                                      
                            onClick={() => {
                                if(!(this.state.inputApiKey?.length)){
                                    message.error('Preencha o formulario')
                                    return;
                                }
                                this.setState({                                    
                                    apiKey: this.state.inputApiKey
                                }, () => {
                                    this.setState({ apiCredentialsModalVisible: false })
                                    message.success('Credenciais atualizadas com sucesso')
                                })
                            }}
                        >
                            Update Credentials
                        </Button>
                    </div>
                ]}
            >
                <div className="modalApiBody">
                    <div style={{marginBottom: 10}}>
                        <span>Change Google Maps API Key:</span>
                        <a target="_blank" rel="noopener noreferrer" href="https://developers.google.com/maps/documentation/embed/get-api-key?authuser=1">Maps Embed API</a>
                    </div>                    
                    <Input.Password size="large" placeholder="Key" prefix={<KeyOutlined />}
                        onChange={(value) => this.setState({ inputApiKey: value.target.value })}
                    />
                </div>
            </Modal>
        )

        const maps = (
            <div style={{width: '100%', height: '100%'}}>
                <iframe
                        style={{float: 'right', opacity: this.state.mapsOpacity}}
                        onMouseEnter={() => {
                            this.setState({ mapsOpacity: 1})                            
                        }}
                        onMouseOut={() => {
                            this.setState({ mapsOpacity: 0.3})
                        }}
                        width="90%"
                        height="90%"
                        frameborder="0"
                        src={`https://www.google.com/maps/embed/v1/place?key=${this.state.apiKey || process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${this.state.mapsQuery}&language=${'en'}`}
                        allowfullscreen
                />                
            </div>                    
        )

        const header = (
            <div style={{position: 'relative', top: 0, left: 0, width: '100%', height: 400, overflow: 'hidden'}}>
                <div style={{position: 'absolute', top: '5%', right: '5%', display: 'flex'}}>
                    {buttonMapsApi}
                    {logoutButton}                    
                </div>                
                {apiCredentialsModal}
                <img src={travela_logo} style={{position: 'absolute', top: '5%', left: '5%', width: '25%', height: 'auto'}}/>                
                <div style={{position: 'relative', top: '45%', left: '0%'}}>
                    <span style={{fontFamily: 'Englebert', fontSize: 35, fontWeight: 'bolder', color: '#273757'}}>
                        The application for your vacation
                    </span>
                </div>
                <div style={{position: 'relative', top: '55%', left: '10%', width:'80%'}}>
                    <span style={{fontFamily: 'Englebert', fontSize: 25, fontWeight: 'bolder'}}>
                        Because we love the most human part of our lives: travelling!                         
                    </span>
                    <br/>
                    <span style={{fontFamily: 'Englebert', fontSize: 25, fontWeight: 'bolder'}}>
                        We are aiming to bring the perfect experience to your vacation research.                     
                    </span>
                    <br/>
                    <span style={{fontFamily: 'Englebert', fontSize: 25, fontWeight: 'bolder'}}>                        
                        It's our mission and desire to provide for you a safe platform to register your future travels.                        
                    </span>
                </div>                
            </div>
        )

        const footer = (
            <div style={{marginTop: 100, width: '100%', height: 400, backgroundImage: 'linear-gradient(rgba(255,255,255,0), rgba(17, 110, 250, 1))'}}>                              
                <div style={{position: 'relative', top: '50%',}}>
                    <div style={{display: 'block'}}>
                        <img src={travela_logo} style={{width: '15%', height: 'auto'}}/>                       
                    </div>  
                    <span style={{fontFamily: 'Englebert', fontSize: 20, fontWidth: 'bold', color: '#fff'}}>
                        Contact us:
                    </span>
                    <MailTwoTone twoToneColor='#fff' style={{marginLeft: 15, fontSize: 18}} />     
                    <a 
                        style={{marginLeft: 5, fontSize: 20, color: '#fff'}}
                        href="mailto:esteves_m_lima@hotmail.com?subject=Nice%20Job"
                    >
                        esteves_m_lima@hotmail.com
                    </a>
                          
                </div>
            </div>
        )

        const travelForm = (            
            <div className="formBody" style={{height: 400, }}>
                <span style={{fontSize: 35, marginBottom: 30, fontWeight: 'bolder', color: '#273757'}}>{`Welcome ${this.state.user?.name || ''}`}</span><br/>
                <span style={{fontSize: 25, marginBottom: 30, fontWeight: 'bolder', color: '#273757'}}>Register a new travel!</span>
                <Input 
                        disabled={this.state.user}
                        defaultValue={this.state.user?.name}
                        style={{width: '100%'}}
                        size="large" placeholder="Name" prefix={<IdcardOutlined />}                        
                        //onChange={(value) => this.setState({ phoneForm: value.target.value })}
                />
                <div style={{width: '100%', display: 'block'}}>
                    <Input 
                        disabled={this.state.user}
                        defaultValue={this.state.user?.phone}
                        style={{width: '49%', marginRight: '2%'}}
                        size="large" placeholder="Phone" prefix={<PhoneOutlined />}                        
                        //onChange={(value) => this.setState({ phoneForm: value.target.value })}
                    />
                    <InputNumber
                        style={{width: '49%'}}
                        size="large"
                        //defaultValue={1}       
                        placeholder="Number of People"                 
                        min={1}
                        max={100}
                        formatter={value => `${value}`}
                        parser={value => value.replace("[^0-9.]", '')}
                        onChange={(value) => this.setState({ peopleNumberForm: value })}
                    />
                </div>                
                <RangePicker 
                    style={{width: '100%'}}
                    size={'large'}
                    disabledDate={d => !d || d.isBefore(moment().format('L'))}
                    format={'YYYY/MM/DD'}
                    placeholder={["From", "To"]}
                    onChange={(date, dateString) => this.setState({ dateRangeForm: dateString })}
                />
                <div style={{width: '100%', display: 'block'}}>
                    <Input 
                        style={{width: '49%', marginRight: '2%'}}
                        size="large" placeholder="Origin" prefix={<HomeOutlined />} 
                        onFocus={() => {
                            this.setState({ mapsOpacity: 1 })
                        }}          
                        onBlur={() => {
                            this.setState({ mapsOpacity: 0.3 })
                        }}             
                        onChange={(value) => {                            
                            this.setState({
                                originForm: value.target.value,
                            }, () => {
                                this.#originTimeOut && clearTimeout(this.#originTimeOut)
                                this.#originTimeOut = setTimeout(() => {
                                    message.info(`Looking for ${this.state.originForm} in maps`)
                                    this.setState({ mapsQuery: this.state.originForm, mapsOpacity: 1 })
                                }, 1500)
                            })                                                        
                        }}
                    />
                    <Input
                        style={{width: '49%'}}
                        size="large" placeholder="Destination" prefix={<CompassOutlined />}   
                        onFocus={() => {
                            this.setState({ mapsOpacity: 1 })
                        }}          
                        onBlur={() => {
                            this.setState({ mapsOpacity: 0.3 })
                        }}                     
                        onChange={(value) => {                            
                            this.setState({
                                destinationForm: value.target.value,
                            }, () => {
                                this.#destinationTimeOut && clearTimeout(this.#destinationTimeOut)
                                this.#destinationTimeOut = setTimeout(() => {
                                    message.info(`Looking for ${this.state.destinationForm} in maps`)
                                    this.setState({ mapsQuery: this.state.destinationForm, mapsOpacity: 1 })
                                }, 1500)
                            })                                                        
                        }}
                    />
                </div>                
                <Button className="buttonRegister" type="primary"               
                    loading={this.state.loading}
                    onClick={() => this.registerTravel()}
                >
                    Register
                </Button>                                            
            </div>
        )

        const travelsList = (            
            <div className="travelsList" style={{height: 400, overflowX: 'hidden', overflowY: 'scroll', }}>
                <span style={{fontSize: 35, fontWeight: 'bolder', color: '#273757'}}>Registered Travels</span>
                <List
                    itemLayout="horizontal"                    
                    dataSource={this.state.user?.travels || []}
                    renderItem={travel => (
                    <List.Item
                        onClick={() => {
                            message.info(`Looking for ${travel.destination} in maps`)
                            this.setState({ mapsQuery: travel.destination, mapsOpacity: 1 })}
                        }
                        onMouseOver={() => this.setState({ hoveredTravel: travel.id}, () => console.log(travel.id))}
                        onMouseOut={() => this.setState({ hoveredTravel: undefined})}
                    >
                        <div 
                            style={{
                                width: '100%', padding: 5, 
                                backgroundColor: (travel.id === this.state.hoveredTravel) ? 'rgba(0, 102, 255, 1)' : null, 
                                color: (travel.id === this.state.hoveredTravel) ? '#fff' : "#000", 
                                borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: '#dedede',
                                borderTopStyle: 'solid', borderTopWidth: 1, borderTopColor: '#dedede'
                            }}                            
                        >                            
                            <div style={{height: 80, float: 'left', width: '85%', display: 'block', fontWeight: 'bold'}}>
                                <div style={{float: 'left', width: '35%'}}>                                    
                                    <span>{`${travel.dateFrom.slice(0,10)}`}</span><br/>
                                    <span>{`-`}</span><br/>
                                    <span>{`${travel.dateTo.slice(0,10)}`}</span>
                                </div>                       
                                <span>{`${travel.peopleNumber} People`}</span><br/>
                                <span>{`Origin : ${travel.origin}`}</span><br/>
                                <span>{`Destination : ${travel.destination}`}</span>
                            </div>  
                            <div style={{height: 80, float: 'right', width: '10%'}}>                            
                                <CloseCircleOutlined style={{fontSize: 40, cursor: 'pointer'}} twoToneColor="#947119"
                                    onClick={() => this.deleteTravel(travel)}
                                />
                            </div>                             
                        </div>                                            
                    </List.Item>
                    )}
                />
            </div>
        )        

        const body = (
            <div style={{width: '100%', display: 'flex', marginTop: 100, paddingLeft: '3%', paddingRight: '3%',}}>
                <div style={{width: '40%', minWidth: 300, display: 'block'}}>
                    {travelForm}
                    {travelsList}                
                </div>
                <div style={{width: '60%', minWidth: 300,}}>
                    {this.state.user && maps}                                                      
                </div> 
            </div>
                       
        );

        const homeView = (
            <div className="homeView" 
                style={{
                    margin: '0 auto', overflowX: 'hidden', overflowY: 'hidden', minWidth: 600, width: '70%', minHeight: 1500,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.95) 45%, rgba(255,255,255,0.3) 80%)'
                }}
            >                
                {header}
                {body}
                {footer}
            </div>                    
        )

        

        return (
            <div id="homePage" style={{}}>               
                
                <div style={{
                    position: 'fixed', height: '100%', width: '100%', 
                    overflowY: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    left: 0, top: 0, zIndex: -1,
                    objectFit: 'cover',
                }}>
                    <AliceCarousel 
                        autoPlay
                        autoPlayInterval="10000"      
                        fadeOutAnimation={true}
                        swipeDisabled={true}
                        buttonsDisabled={true}
                        dotsDisabled={true}
                        playButtonEnabled={false}
                        keysControlDisabled={true}                                    
                    >
                        {
                            this.#imgList.map((imgUrl) => {
                                return (                                
                                    <img src={imgUrl} className="sliderimg"
                                        style={{    
                                                                                    
                                            flexShrink: 0, minWidth: '100%', minHeight: '100%', margin: 'auto',
                                        }} 
                                    />                                  
                                )
                            })
                        }                                        
                    </AliceCarousel>   
                </div>                             
                {
                    this.state.user ? homeView : loginView
                }                
            </div>
        )
    }
}