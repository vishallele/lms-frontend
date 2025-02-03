'use client';

import { Alert } from "@heroui/react";

//custom import
import useNotification from "@/hooks/useNotification";

const Notification = () => {

  const { title, type, isOpen, closeNotification } = useNotification();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center my-3">
          <Alert color={type} title={title} onClose={() => closeNotification('', 'default')} />
        </div>
      </div>
    </div>
  )
}

export default Notification;