import React, { Component } from "react";
import { Link } from "react-router-dom";
import bg from "../img/Home.png";
import {
    Button,
    Container,
    Form,
    FormGroup,
    Input
} from 'reactstrap';
import api from "./api"



class Home extends Component {
    state = {
        email: "",
        password: "",
        errors: {}
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }
    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        }

        api("auth/customer/login", userData, 200).then(res => {
            
            if (res.statusCode == 200) {
                window.localStorage.setItem('token', res.token);
                this.props.history.push("/home/customer");
                
            }
            else {
                alert("Error")
            }
        }
        ).catch(e => console.log(e))
    }

    render() {

        return (
            // <div className="home-page">
            
          <container>
            <button type="button" class="btn btn-outline-dark btn">MENU</button>
            <button type="button" class="btn btn-outline-dark">ABOUT US</button>
            <button type="button" class="btn btn-outline-dark">DEALS</button>
            <button type="button" class="btn btn-outline-dark">LOGIN</button>
            <img src={bg} alt="bg" className="img-fluid"/> 
            
                <div className="container main">
                {/* <div className="btn-handler">         
                    <Button className="menuu-btn" onClick={() => {
                       
                    }}>MENU</Button>
                </div>

                <div className="aboutt-btn-handler">         
                    <Button className="aboutt-btn" onClick={() => {
                        
                    }}>ABOUT US</Button>
                </div>

                <div className="btn-handler">         
                    <Button className="loginn-btn" onClick={() => {
                        this.props.history.push('/login');
                    }}>LOGIN</Button>
                </div> */}
                
                    {/*<p className="brand-name">CANDY SHOP</p>*/}
                    {/* <p className="title">Login</p> */}
                    <Form className="reg-form" noValidate onSubmit={this.onSubmit}>
                        {/* <FormGroup>
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                onChange={this.onChange}
                                value={this.state.email}
                                id="email"
                            />
                        </FormGroup> */}
                        {/* <FormGroup className="password-container">
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                onChange={this.onChange}
                                value={this.state.password}
                                id="password"
                            />
                        </FormGroup> */}
                        {/* <div className="btn-handler">
                            <Link to="/forgot-password/customer" className="link" style={{ marginleft: "14%" }}>Forgot Password? :(</Link>
                        </div> */}
                        <div className="order-btn-handler">
                            
                                
                            <Button className="orderNow-btn" onClick={() => {
                                this.props.history.push('/menu');
                            }}>Order Now</Button>
                        </div>

                        


                        {/* <div className="btn-handler">
                            <Link to="/login/admin" className="link">Login as Admin</Link>
                        </div> */}
                    </Form>
                </div>
         
        </container>
        
        
      
        )    
    }
}

export default Home;   