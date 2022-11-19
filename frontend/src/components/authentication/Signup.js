import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const Signup = () => {
   const history=useHistory();
    const [show, setShow] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmpassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleClick=()=>setShow(!show);

    const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined){
          toast({
            title:"Please select an image!",
            status : "warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
          })
            return;
        }
        console.log(pics);
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
          const data=new FormData();
          data.append("file",pics);
          data.append("upload_preset","gossip")
          data.append("cloud_name","dufgkbr1v");
          fetch("https://api.cloudinary.com/v1_1/dufgkbr1v/image/upload",{
            method:"post",
            body:data,
          })
          .then((res)=>res.json())
          .then((data)=>{
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
          })
          .catch((err)=>{
            console.log(err);
            setLoading(false);
          })
        }else{
          toast({
            title:"Please select an image!",
            status : "warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
          });
          setLoading(false);
          return;
        }
    }

    const submitHandler=async()=>{
      setLoading(true);
      if(!name || !email || !password || !confirmPassword){
        toast({
          title:"Please fill all the feilds",
          status : "warning",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
        return;
      }
      if(password!==confirmPassword){
        toast({
          title:"Passwords Do not match",
          status : "warning",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        return;
      }
      console.log(name, email, password, pic);
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
          },
        };
        const {data} =await axios.post("/api/user",{name,email,password,pic},config);
        console.log(data);
        toast({
          title:"Registration Successfull",
          status : "success",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        history.push('/chats')
      } catch (error) {
        toast({
          title:"Error Occured!",
          description:error.response.data.message,
          status : "error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
      }

    }

  return (
    <VStack spacing="5px">
      <FormControl id='first-name' isRequired>
        <FormLabel>
            Name
            <Input placeholder='Enter your name' onChange={(e)=>setName(e.target.value)}/>
        </FormLabel>
      </FormControl>
      <FormControl id='signup-email' isRequired>
        <FormLabel>
            Email
            <Input placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)}/>
        </FormLabel>
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>
            Password
            <InputGroup>
                <Input type={show?"text":"password"} placeholder='Enter your Password' onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show?"Hide":"Show"}
                    </Button>
                
                </InputRightElement>
            </InputGroup>
        </FormLabel>
      </FormControl>

      <FormControl id='cpassword' isRequired>
        <FormLabel>
            Confirm Password
            <InputGroup>
                <Input type={show?"text":"password"} placeholder='Confirm your Password' onChange={(e)=>setConfirmpassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show?"Hide":"Show"}
                    </Button>
                
                </InputRightElement>
            </InputGroup>
        </FormLabel>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>
            Upload your Picture
            <Input type="file" p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormLabel>
      </FormControl>

      <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
      
    </VStack>
  )
}

export default Signup
