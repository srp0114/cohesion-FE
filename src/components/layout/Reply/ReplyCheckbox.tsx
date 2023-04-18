import React, { useState } from 'react';
import { Checkbox } from '@mui/material';

interface ReplyCheckboxProps {
  onReplyCheck: (isChosen:boolean) => void;
}

const ReplyCheckbox = (props: ReplyCheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    props.onReplyCheck(isChecked);
  };

  return (
    <Checkbox
      checked={isChecked}
      onChange={handleChange}
      color="success"
    />
  );
}

export default ReplyCheckbox;
