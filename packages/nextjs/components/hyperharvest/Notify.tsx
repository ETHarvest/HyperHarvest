import React from "react";
import { notification } from "~~/utils/scaffold-eth";

/**
 * Custom notification content for TXs.
 */
const TxnNotification = ({ message, blockExplorerLink }: { message: string; blockExplorerLink?: string }) => {
  return (
    <div className="flex flex-col ml-1 cursor-default">
      <p className="my-0">{message}</p>
      {blockExplorerLink && blockExplorerLink.length > 0 ? (
        <a href={blockExplorerLink} target="_blank" rel="noreferrer" className="block link text-md">
          Check out transaction
        </a>
      ) : null}
    </div>
  );
};

/**
 * Function to trigger a transaction notification.
 */
export const showTxnNotification = (message: string, blockExplorerLink?: string) => {
  notification.info(<TxnNotification message={message} blockExplorerLink={blockExplorerLink} />, {
    position: "top-right",
    duration: 10000,
  });
};
