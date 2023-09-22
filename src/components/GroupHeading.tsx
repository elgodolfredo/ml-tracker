import React, { useState } from 'react';
import {
  Heading,
  Button,
  Input,
} from '@chakra-ui/react';

interface GroupHeadingProps {
  groupName: string;
  onEditClick: () => void;
  onSaveClick: (editedGroupName: string) => void;
  onCancelClick: () => void;
  onGroupNameChange: (editedGroupName: string) => void;
  isEditing: boolean;
  editedGroupName: string;
}

const GroupHeading: React.FC<GroupHeadingProps> = ({
  groupName,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onGroupNameChange,
  isEditing,
  editedGroupName,
}) => {
  return (
    <Heading size="lg">
      {isEditing ? (
        <>
          <Input
            value={editedGroupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
          />
          <Button
            colorScheme="teal"
            size="sm"
            ml={2}
            onClick={() => onSaveClick(editedGroupName)}
          >
            Save
          </Button>
          <Button
            colorScheme="gray"
            size="sm"
            ml={2}
            onClick={onCancelClick}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          {groupName}
          <Button
            colorScheme="teal"
            size="sm"
            ml={2}
            onClick={onEditClick}
          >
            Edit Group Name
          </Button>
        </>
      )}
    </Heading>
  );
};

export default GroupHeading;
