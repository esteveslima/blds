import Login from '../Login/login'
import Cookies from 'js-cookie';
import travela_logo from '../../assets/images/blds_travela_logo.png'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { Input, Button, List, message, Modal, DatePicker, InputNumber} from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import './home.css'
import jwt from 'jsonwebtoken';
import { PhoneOutlined, HomeOutlined, CompassOutlined, CloseCircleOutlined, IdcardOutlined } from '@ant-design/icons';
import React, { Component } from 'react'

const { RangePicker } = DatePicker;


const { TextArea } = Input;
const backendURL = `http://${process.env.REACT_APP_BACK_END_HOST}:${process.env.REACT_APP_BACK_END_PORT}${process.env.REACT_APP_BACK_END_ROUTE}`

export default class Home extends Component {

    #authToken = undefined;
    #imgList = [
        'https://www.visitmammoth.com/sites/default/files/images/trip_ideas/hero_images/hiking-mammoth-mountain.jpg',
        'https://sassytownhouseliving.com/wp-content/uploads/2019/10/Mountain-Hiking-As-A-Couple-5-Tips-You-Need-To-Know-7-1024x772.jpg',
        'https://www.colorado.com/sites/default/files/namkcaps-02231.jpg',
        'https://cdn2.wanderlust.co.uk/media/1060/lists-europes-8-best-day-hikes.jpg?anchor=center&mode=crop&width=1200&height=0&rnd=131484726710000000',
        'https://images.vailresorts.com/image/upload/c_scale,dpr_3.0,f_auto,q_auto,w_500/v1/Vail/Products/Brochure/Explore%20the%20Resort/Activities%20and%20Events/Summer%20Activities/Hiking/Vail-HikingAndBackpacking-4.jpg',        
        'https://www.backpacker.com/.image/t_share/MTUyODM1NzcyODg4Nzg2NDcw/bp0318feat_buildit_msttandem95757786_gn.jpg',
        'https://miro.medium.com/max/8064/1*1b3yt0vPJ0uELSn7_iUDuw.jpeg',
        'https://cdn.cnn.com/cnnnext/dam/assets/190304143013-best-hiking-trails---bhutan-blue-poppy.jpg',
        'https://northernvirginiamag.com/wp-content/uploads/2020/04/old-rag-hike-adobe-stock.jpg',
        'https://www.chrisistace.com/wp-content/uploads/2019/07/Pogo-Mountain_Hike-Vancouver-Island_Chris-Istace_feature-image.jpg',
        'https://assets.investsuite.com/updates/about-mifid/about-mifid-img-1.jpeg',
    ]

    constructor(props) {
        super(props)                

        this.state = {

            user: undefined,                                    
            
            //nameForm: undefined,
            //phoneForm: undefined,
            peopleNumberForm: undefined,
            dateRangeForm: [],
            originForm: undefined,
            destinationForm: undefined,

            loadingRegisterForm: false,
        }

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
            <div className="logoutButton" style={{position: 'absolute', top: '5%', right: '5%', width: 100, height: 50}}>
                <Button className="buttonRegisterTravel"
                    style={{position: 'absolute', top: '10%', left: '5%'}}
                    loading={this.state.loadingRegister}
                    onClick={() =>  this.setState({user: undefined})}
                >
                    Logout
                </Button>
            </div>
        )

        const header = (
            <div style={{position: 'relative', top: 0, left: 0, width: '100%', height: 400, overflow: 'hidden'}}>
                {logoutButton}
                <img src={travela_logo} style={{position: 'absolute', top: '5%', left: '5%', width: '25%', height: 'auto'}}/>                
                <div style={{position: 'relative', top: '35%', left: '0%'}}>
                    <span style={{fontFamily: 'Englebert', fontSize: 35}}>
                        The application for your vacation
                    </span>
                </div>
                <div style={{position: 'relative', top: '45%', left: '10%', width:'80%'}}>
                    <span style={{fontFamily: 'Englebert', fontSize: 25}}>
                        Because we love the most human part of our lives: travelling!                         
                    </span>
                    <br/>
                    <span style={{fontFamily: 'Englebert', fontSize: 25}}>
                        We are aiming to bring the perfect experience to your vacation research.                     
                    </span>
                    <br/>
                    <span style={{fontFamily: 'Englebert', fontSize: 25}}>                        
                        It's our mission and desire to provide for you a safe platform to register your future travels.                        
                    </span>
                </div>                
            </div>
        )

        const footer = (
            <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: 80, backgroundColor: '#06f', overflow: 'hidden'}}>                              
                <div  style={{position: 'absolute', top: '0%', left: '40%'}}>
                    <span style={{fontFamily: 'Englebert', fontSize: 35}}>
                        Contact us
                    </span>
                </div>
            </div>
        )

        const travelForm = (            
            <div className="formBody" style={{position: 'absolute', top: 470, left: '5%', minWidth: 200, width: '32%', height: 400, }}>
                <span style={{fontSize: 25, marginBottom: 30}}>{`Welcome ${this.state.user?.name}`}</span><br/>
                <span style={{fontSize: 25, marginBottom: 30}}>Register a new travel!</span>
                <div style={{width: '100%', display: 'block'}}>
                    <Input 
                        disabled={true}
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
                        onChange={(value) => this.setState({ originForm: value.target.value })}
                    />
                    <Input
                        style={{width: '49%'}}
                        size="large" placeholder="Destination" prefix={<CompassOutlined />}                        
                        onChange={(value) => this.setState({ destinationForm: value.target.value })}
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
            <div className="travelsList" style={{position: 'absolute', top: 470, right: '5%', minWidth: 300, width: '48%', height: 400, overflowX: 'hidden', overflowY: 'scroll', }}>
                <span style={{fontSize: 25}}>Registered Travels</span>
                <List
                    itemLayout="horizontal"
                    style={{position: 'absolute', top: '20%', right: '5%', width: '90%'}}
                    dataSource={this.state.user?.travels || []}
                    renderItem={travel => (
                    <List.Item>
                        <div style={{width: '100%', padding: 5, borderStyle: 'dotted', borderWidth: 1}}>                            
                            <div style={{height: 80, float: 'left', width: '85%', display: 'block'}}>
                                <div style={{float: 'left', width: '35%'}}>
                                    <span>{`${travel.peopleNumber} People`}</span><br/>
                                    <span>{`${travel.dateFrom.slice(0,10)}`}</span><br/>
                                    <span>{`-`}</span><br/>
                                    <span>{`${travel.dateTo.slice(0,10)}`}</span>
                                </div>                       
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
            <div style={{display: 'flex'}}>
                {travelForm}
                {this.state.user && travelsList}
            </div>            
        );

        const homeView = (
            <div className="homeView" style={{position: 'absolute', top: 0, left: '20%', overflowX: 'hidden', overflowY: 'hidden', minWidth: 600, width: '60%', height: '150%', backgroundImage: 'radial-gradient(rgba(255,255,255,1) 10%, rgba(255,255,255,0.7) 90%)'}}>                
                {header}
                {body}
                {footer}
            </div>                    
        )

        

        return (
            <div id="homePage" style={{}}>               
                <div style={{position: 'fixed', overflowY: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', left: 0, top: 0, zIndex: -1, width: '100%',}}>                    
                    <AliceCarousel 
                        autoPlay
                        autoPlayInterval="5000"      
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
                                    <img src={imgUrl} style={{flexShrink: 0, minWidth: '100%', minHeight: '100%', backgroundRepeat: 'no-repeat'}} className="sliderimg"/>
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