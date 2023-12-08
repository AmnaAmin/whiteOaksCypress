import React, { useState, useEffect} from 'react';
import { Switch as ChakraSwitch, FormControl, FormLabel } from '@chakra-ui/react';
import { triggerLockAPI, checkBranchLocked } from 'api/merge_window_api';


const MergeWindowActions: React.FC = () => {

  const [isCheckedConstFe,setCheckedConstFe ] = useState(false);

  const [isCheckedConstBe, setCheckedConstBe ] = useState(false);

  const [isCheckedEstFe, setCheckedEstFe ] = useState(false);

  const [isCheckedEstBe, setCheckedEstBe ] = useState(false);

  const [isCheckedMaintFe, setCheckedMaintFe ] = useState(false);

  const [isCheckedMaintBe, setCheckedMaintBe ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      var response;

      for (let i = 1; i <= 6; i++)  {
         response = await checkBranchLocked(i);
           if(response === 0)
             setCheckedValue(i, true);
           else if(response === 1)
             setCheckedValue(i, false);
            }
    };
  
    fetchData();

  }, []); 
  
 const handleToggle = async (isChecked: boolean, option: number) => {
 
  
  var userToken = window.prompt('Please enter your token:');
    const response = await triggerLockAPI(userToken, option, isChecked);

    if(response === 0)
    {
      setCheckedValue(option, true);
  
    }  
    else if(response === 1)
    {
      setCheckedValue(option, false);
    }
  

 };

 const setCheckedValue = (option : number, isChecked: boolean) => {
  switch(option){
    case 1:
        setCheckedConstFe(isChecked);
        break;
    case 2:
        setCheckedConstBe(isChecked);
        break;
    case 3:
      setCheckedEstFe(isChecked);
        break;
    case 4:
       setCheckedEstBe(isChecked);
        break;   
    case 5:
      setCheckedMaintFe(isChecked);
      break;
    case 6:
      setCheckedMaintBe(isChecked);
        break;       
    default:
      break;              
}
 }

  return (
  <div>
     <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="toggle-switch" marginRight="4" flex="1">
      Construction Frontend
      </FormLabel>
      <ChakraSwitch
        id="toggle-switch"
        isChecked={isCheckedConstFe}
        onChange={(e) => handleToggle(e.target.checked, 1)}
      />
    </FormControl>

    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="toggle-switch" marginRight="4" flex="1">
      Construction Backend
      </FormLabel>
      <ChakraSwitch
        id="toggle-switch"
        isChecked={isCheckedConstBe}
        onChange={(e) => handleToggle(e.target.checked, 1)}
      />
    </FormControl>

    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="toggle-switch" marginRight="4" flex="1">
      Estimates Frontend
      </FormLabel>
      <ChakraSwitch
        id="toggle-switch"
        isChecked={isCheckedEstFe}
        onChange={(e) => handleToggle(e.target.checked, 3)}
      />
    </FormControl>

    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="toggle-switch" marginRight="4" flex="1">
      Estimates Backend
      </FormLabel>
      <ChakraSwitch
        id="toggle-switch"
        isChecked={isCheckedEstBe}
        onChange={(e) => handleToggle(e.target.checked, 4)}
      />
    </FormControl>

    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="toggle-switch" marginRight="4" flex="1">
      Maintenance Frontend
      </FormLabel>
      <ChakraSwitch
        id="toggle-switch"
        isChecked={isCheckedMaintFe}
        onChange={(e) => handleToggle(e.target.checked, 5)}
      />
    </FormControl>

    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="toggle-switch" marginRight="4" flex="1">
      Maintenance Backend
      </FormLabel>
      <ChakraSwitch
        id="toggle-switch"
        isChecked={isCheckedMaintBe}
        onChange={(e) => handleToggle(e.target.checked, 6)}
      />
    </FormControl>
   
 </div>
  );

};


export default MergeWindowActions;
      