import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  
} from "@nextui-org/react";
import { useSelector } from "react-redux";

// Define the props type for the Avatarr component
interface AvatarrProps {
  loggingOutUser: () => void; // Function type for logging out user
}

const Avatarr: React.FC<AvatarrProps> = ({ loggingOutUser }) => {
  // Use useSelector to get the username from the Redux store
  const username = useSelector((state: any) => state.user.username);

  return (
    <div className="flex items-center gap-2 mb-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            
          />
        </DropdownTrigger>

        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-12 gap-1">
            <p className="font-semibold">Signed in as {username}</p>
          </DropdownItem>

          <DropdownItem key="logout" color="danger" onClick={loggingOutUser}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Avatarr;
