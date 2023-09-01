import React, { useState, useEffect } from 'react';
import { UserOutlined, LineChartOutlined, DoubleRightOutlined, UnorderedListOutlined, PlusOutlined, CalendarOutlined, MenuUnfoldOutlined, ClearOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Card, Divider, Modal, Input, Row, Col, DatePicker, message } from 'antd';
import { collection, addDoc,setDoc, getDocs, doc, deleteDoc, where, query } from "firebase/firestore";
import {useAuthContext} from "../../../context/Authcontext"
import  {firestore,auth} from '../../../config/firebase'
import { signOut } from 'firebase/auth';
import { Link,useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;
const App = () => {
  const Navigate=useNavigate()
  const { dispatch } = useAuthContext()
  const [collapsed, setCollapsed] = useState(false);
  const [todos, setTodos] = useState([])
  const [state, setState] = useState({date:""})
  const handleSubmit=async ()=>{
    const {date}=state
    if(!date){
        return message.error("Enter Date")
    }
    const q = query(collection(firestore, "todos"), where("date", "==", date));
    const querySnapshot = await getDocs(q);
    let array = []
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log(doc.id, " => ", doc.data());
        array.push(data)
    });
    setTodos(array)
    console.log('todos', array)
  }
    
  
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const handleDelete = async (todo) => {
    try {
      await deleteDoc(doc(firestore, 'todos', todo.id));
      let deletedDocument=document.filter(doc=>doc.id!==todo.id)
      setTodos(deletedDocument)
      message.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting Todo: ', error);
    }
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        message.success('Signout successful');
        dispatch({ type: 'SET_LOGGED_OUT' });
      })
      .catch((err) => {
        message.error('Signout not successful');
      });
  }
  return (
    <Layout >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <span><Button type="text" theme="dark" icon={collapsed ? <MenuUnfoldOutlined /> : <h4 style={{ margin: "10px" }}>Menu</h4>} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '16px',margin: "10px ",width: 64,height: 70,color: "white", }}></Button></span>
        <Menu theme="dark" mode="inline"  defaultSelectedKeys={['1']} items={[
            {key: '1',icon: <UserOutlined />,label: 'Task',children: [   
                {icon: <Link to='/upcomming'><DoubleRightOutlined /></Link>,label: "Upcomming" },
                {icon: <Link to="/today"><VerticalAlignBottomOutlined /></Link>,label: "Today"},
                {icon: <Link to="/calendar"><CalendarOutlined /></Link>,label: "Calender"},
                {icon: <Link to="/"><UnorderedListOutlined /></Link>, label: "Todos"},]},
            { key: '2', icon: <UnorderedListOutlined />, label: 'List', children:[    
                {icon:<Link to="/personal"> <UserOutlined /></Link>,label: "Personal"},
                {icon:<Link to="/work"><LineChartOutlined /></Link>, label: "Work"}, ]},
            { key: '3', icon: <ClearOutlined />, label: <p onClick={handleLogout}>Signout</p>,},]}/>
      </Sider>
      <Content
        style={{ minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", background: colorBgContainer, }}><h1>Calander</h1>
        <label htmlFor="date">Enter Date To get Todos:</label>
        <div className="input-group mb-3">
        <Input type="date" className="form-control"aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={handleChange} name="date"/>
        <div className="input-group-append">
          <button className="btn btn-success" type="button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
        <Divider />
        <div className="container">
          <ul className="row">
            {/* <li className='col text-center' style={{listStyleType:"none"}}>
                    <label htmlFor="Date">Enter Date To cheak Todos</label>
                    <Input placeholder="Enter Date" type='date' className='form-control my-2'  name="date" onChange={handleChange} />
                    <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
            </li> */}
            {todos.map((todo) => (
              <li className="col-4" style={{ listStyleType: 'none' }} key={todo.id}>
                <div className="stick" style={{ backgroundColor: todo.color || '#F8F9FA', padding: '10px', marginBottom: '10px', borderRadius: '10px', height: '250px', }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <h4>{todo.title}</h4>
                    <div className="dropdown">
                      <div className="dropdown-toggle"></div>
                      <div className="dropdown-content  text-center">
                        <button className='btn btn-light'  onClick={() => Navigate(`update/${todo.id}`)}><EditOutlined className="m-1" /></button>
                        <button className='btn btn-light mt-1' onClick={() => handleDelete(todo)}>
                          <DeleteOutlined className="mx-1 mb-1" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="stickyDescription">
                    <p>{todo.status}</p>
                    <p>{todo.description}</p>
                  </div>
                  <p>{todo.dateCreated?.seconds && new Date(todo.dateCreated.seconds * 1000).toLocaleString()}</p>
                </div>
              </li>))}
          </ul>
        </div>
      </Content>
    </Layout>);};
export default App;