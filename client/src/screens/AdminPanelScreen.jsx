import {
  Box,
  Tabs,
  Heading,
  Stack,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UsersTab from "../components/UsersTab";

const AdminPanelScreen = () => {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  return userInfo && userInfo.isAdmin ? (
    <Box padding={"20px"} minHeight={"100vh"}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        align={{ lg: "flex-start" }}
      >
        <Stack
          paddingRight={{ base: "0", md: "14" }}
          spacing={{ base: "8", md: "10" }}
          flex={"1.5"}
          marginBottom={{ base: "12", md: "none" }}
        >
          <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
            Admin Panel
          </Heading>
          <Tabs size={"md"} variant={"enclosed"}>
            <TabList>
              <Tab>Products</Tab>
              <Tab>Reviews</Tab>
              <Tab>Orders</Tab>
              <Tab>Users</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <UsersTab />
              </TabPanel>
              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
    </Box>
  ) : (
    <Navigate to={`/`} replace={true} state={{ from: location }} />
  );
};

export default AdminPanelScreen;
