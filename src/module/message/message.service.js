import { MessageFilterTypeEnum } from "../../common/enum/message.enum.js";
import { NotFoundException } from "../../common/exceptions/app.exceptions.js";
import {
  createDoc,
  deleteDoc,
  findAndCountAllDoc,
  findByIdDoc,
  findOneDoc,
} from "../../DB/db.repo.js";
import messageModel from "../../DB/model/message.model.js";
import userModel from "../../DB/model/user.model.js";

export async function sendMessage(bodyData, filesData, user) {
  const { content, receiverId } = bodyData;

  const receiver = await findByIdDoc({ model: userModel, id: receiverId });

  if (!receiver) {
    throw NotFoundException({ errMsg: "Receiver Not found" });
  }

  const filePaths = filesData.map((file) => {
    return file.finalPath;
  });

  return await createDoc({
    model: messageModel,
    insertedData: {
      content,
      attachments: filePaths,
      receiverId,
      senderId: user?._id,
    },
  });
}

export async function deleteMessage(messageId, user) {
  const message = await deleteDoc({
    model: messageModel,
    filter: { _id: messageId, receiverId: user.id },
  });

  if (!message.deletedCount) {
    throw NotFoundException({ errMsg: "Message Not found" });
  }
}

export async function getOneMessage(messageId, user) {
  const message = await findOneDoc({
    model: messageModel,
    filter: {
      _id: messageId,
      $or: [{ receiverId: user.id }, { senderId: user.id }],
    },
  });

  if (!message) {
    throw NotFoundException({ errMsg: "Message Not found" });
  }
  return message;
}

export async function getAllMessage(queryData, user) {
  const { page, limit, filterType } = queryData;

  let queryFilter;

  switch (filterType) {
    case MessageFilterTypeEnum.RECEIVER:
      queryFilter = { receiverId: user.id };
      break;

    case MessageFilterTypeEnum.SENDER:
      queryFilter = { senderId: user.id };
      break;

    default:
      queryFilter = {
        $or: [{ receiverId: user.id }, { senderId: user.id }],
      };
      break;
  }

  const { docs, count } = await findAndCountAllDoc({
    model: messageModel,
    filter: queryFilter,
    // populate: ["senderId", "receiverId"],
    pagination: { page, limit },
  });

  if (!docs.length) {
    throw NotFoundException({ errMsg: "No Messages Yet" });
  }

  return {
    messages: docs,
    totalPages: Math.ceil(count / limit),
    totalNoOfMessages: count,
    currentPage: page,
    maxDocPerPage: limit,
  };
}
