import { Request } from "express";
import fs from "fs";
import { ContextUser } from "gqlContext";
import { ApolloContext } from "gqlContext";
import jwt from "jsonwebtoken";
import { USERS_CONTENT } from "./constants";
import { services } from "./services";

type ReadDirAsync = (dir: string) => Promise<string[]>;

const readDirAsync: ReadDirAsync = async dir =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

type GetAvatarSrcAsync = (userId: string) => Promise<string>;

const getAvatarSrcAsync: GetAvatarSrcAsync = async userId => {
  const userDir = `${USERS_CONTENT}/${userId}/`;
  let src = "";

  const userFiles = await readDirAsync(userDir);
  userFiles.forEach(file => {
    const fileName = file.split(".")[0];
    if (fileName === "avatar") {
      src = userDir + file;
    }
  });

  return src;
};

type GetVerifiedUser = (authToken: string) => Promise<null | ContextUser>;

const getVerifiedUser: GetVerifiedUser = async authToken => {
  let token = authToken;
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trimLeft();
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Error(`couldn't find secret from env`);
  }
  return new Promise(resolve => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // reject(err);
        resolve(null);
      } else {
        resolve(decoded as ContextUser);
        // jwt typings do not allow me to give type to decoded
      }
    });
  });
};

interface ConnectionParams {
  authToken?: string;
}

type OnWebScoketConnect = (
  connectionParams: ConnectionParams
) => Promise<ApolloContext>;

const onWebScoketConnect: OnWebScoketConnect = async connectionParams => {
  const context: ApolloContext = { services };

  if (!connectionParams.authToken) return context;
  const verifiedUser = await getVerifiedUser(connectionParams.authToken);
  context.user = verifiedUser!; // do not use ! refactor
  return context;
};

type CreateContext = ({
  req,
  connection
}: {
  req: Request;
  connection: { context: ApolloContext };
}) => ApolloContext;

const createContext: CreateContext = ({ req, connection }) => {
  if (connection) {
    return connection.context;
  }

  const context: ApolloContext = {
    services,
    user: req.user
  };
  return context;
};

export {
  getAvatarSrcAsync,
  getVerifiedUser,
  onWebScoketConnect,
  createContext
};
