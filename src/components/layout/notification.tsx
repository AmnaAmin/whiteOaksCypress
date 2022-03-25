// import { Box, Center, Flex, MenuList, Text } from '@chakra-ui/react'
import { MenuList } from '@chakra-ui/react'

// import { getEntities as getAlerts } from "app/entities/alert/alert-history/alert-history.reducer";
// import { IRootState } from "app/shared/reducers";
// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import { BiXCircle } from 'react-icons/bi'
// import { shallowEqual, useDispatch, useSelector } from "react-redux";

// type NotificationValueType = {
//   textTop: string;
//   textSecond: string;
//   textThird: string;
// };

// const NotificationStructure = (props: NotificationValueType) => {
//   return (
//     <Flex
//       borderRadius={8}
//       width="480px"
//       boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
//     >
//       <Center borderLeftRadius={8} bg="#BEE3F8" color="white" p="10px" w="68px">
//         <BiXCircle size="35px" color="#4299E1" />
//       </Center>
//       <Box flexDir="column" pl={5} p={3} lineHeight={7}>
//         <Text fontSize={16} fontWeight={700}>
//           {props.textTop}
//         </Text>

//         <Text fontSize={14} fontWeight={400} maxWidth={330}>
//           {props.textSecond}
//         </Text>

//         <Text fontSize={14} color="#A0AEC0">
//           {props.textThird}
//         </Text>
//       </Box>
//     </Flex>
//   );
// };

const Notification = () => {
  // const dispatch = useDispatch();
  // const [filteredAlerts, setFilteredAlerts] = useState([]);
  // useEffect(() => {
  //   // dispatch(getAlerts(""));
  // }, []);

  // const { login } = useSelector(
  //   (state: IRootState) => state.authentication.account,
  //   shallowEqual
  // );
  // const { entities: alerts = [] } = useSelector(
  //   (state: IRootState) => state.alertHistory,
  //   shallowEqual
  // );
  // const { currentLocale } = useSelector(
  //   (state: IRootState) => state.locale,
  //   shallowEqual
  // );
  // useEffect(() => {
  //   if (!alerts.length) return;
  //   const filterAlerts = alerts
  //     .filter((a) => a.login === login)
  //     // sort by id to bring latest alert on top  and  sort by unread status
  //     .sort((x, y) => +y?.id - +x?.id)
  //     ?.sort((x, y) =>
  //       x?.webSockectRead === y?.webSockectRead ? 0 : x?.webSockectRead ? 1 : -1
  //     );
  //   setFilteredAlerts(filterAlerts);
  // }, [alerts, login]);
  return (
    <>
      <MenuList borderRadius={8}>
        {/* <MenuList maxH="calc(100vh - 110px)" border="none" overflow="scroll">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <MenuItem key={alert.id}>
                <NotificationStructure
                  textTop={alert.subject}
                  textSecond={alert.message}
                  textThird={
                    alert?.dateCreated
                      ? moment(alert?.dateCreated)
                          .locale(currentLocale)
                          .fromNow()
                      : null
                  }
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem>No new notifications</MenuItem>
          )}
        </MenuList> */}
      </MenuList>
      {/* Will integrate all notification button in future  */}
      {/* <Center p="4">
         <Box w="140px" borderBottom="1px solid" color="#4E87F8" fontSize={14}>
           <Link to={''}>View All Notification</Link>
         </Box>
       </Center> */}
    </>
  )
}

export default Notification
