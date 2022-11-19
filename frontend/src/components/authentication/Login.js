import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, useToast,InputRightElement, VStack } from '@chakra-ui/react'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const Login = () => {
   const history=useHistory();
    const [show, setShow] = useState()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const handleClick=()=>setShow(!show);

   
    const submitHandler=async ()=>{
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
  
      // console.log(email, password);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
  
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );
  
        // console.log(JSON.stringify(data));
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        window.location.reload()
        history.push("/chats");
       
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      
    }
  return (
    <VStack spacing="5px">
      <FormControl id='login-email' isRequired>
        <FormLabel>
            Email
            <Input placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </FormLabel>
      </FormControl>
      <FormControl id='login-password' isRequired>
        <FormLabel>
            Password
            <InputGroup>
                <Input type={show?"text":"password"} placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show?"Hide":"Show"}
                    </Button>
                
                </InputRightElement>
            </InputGroup>
        </FormLabel>
      </FormControl>

     

      <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
        Login
      </Button>
      <Button variant="solid" colorScheme="red" width="100%" style={{marginTop:15}} onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456");
      }}>
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login
