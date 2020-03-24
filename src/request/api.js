import { get, post } from './http'
/**
 * 
 * @param {long} id 
 * @param {string} username 
 * @param {string} pwdMd5 
 */
export const admin = (id, username, pwdMd5) => post("/admin", {id, username, pwdMd5});
export const similarFunction = (projectId, funcName) => get("/project/" + projectId + "/similarFunction", funcName);

/**
 * 添加管理员登录凭证
 * @param {string} username 
 * @param {string} pwdMd5 
 */
export const adminSession = (username, pwdMd5) => post("pwdMd5", {username, pwdMd5});

/**
 * 查询子图最短路
 * @param {long} projectId 
 * @param {long} subgraphId 
 * @param {long} startVertexId 
 * @param {long} endVertexIndex 
 */
export const subgraphShortestPath = (projectId, subgraphId, startVertexId, endVertexIndex) => get("/project/" + projectId + "/subgraph/" + subgraphId + "/subgraphShortestPath", {startVertexId, endVertexIndex});

/**
 * 查询原图最短路
 * @param {long} projectId 
 * @param {long} startVertexId 
 * @param {long} endVertexId 
 */
export const originalGraphShortestPath = (projectId, startVertexId, endVertexId) => get("/project/" + projectId + "/originalGraphShortestPath", {startVertexId, endVertexId});