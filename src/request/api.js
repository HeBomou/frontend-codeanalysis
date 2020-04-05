import { get, post, del, put } from './http'
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
export const adminSession = (username, pwdMd5) => post("/adminSession", {username, pwdMd5});

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

/**
 * 查询子图
 * @param {long} projectId 
 */
export const subgraph = (projectId) => get("/project/" + projectId + "/subgraph", {});

/**
 * 移除子图
 * @param {long} projectId 
 * @param {long} id 
 */
export const delSubgraph = (projectId, id) => del("/project/" + projectId + "/subgraph/" + id);

/**
 * 添加子图
 * @param {long} projectId 
 * @param {double} threshold 
 */
export const addSubgraph = (projectId, threshold) => post("/project/" + projectId + "/subgraph", threshold);

/**
 * 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
 * @param {long} userId 
 */
export const getProjects = (userId) => get("/project", userId);

/**
 * 根据项目id查寻项目
 * @param {long} projectId 
 */
export const getProject = (projectId) => get("/project/" + projectId);

/**
 * 移除项目
 * @param {long} id 
 */
export const delProject = (id) => del("/project" + id);

/**
 * 添加项目
 * @param {string} projectName 
 * @param {string} url 	git仓库的url
 * @param {string} userId 
 */
export const addProject = (projectName, url, userId) => post("/project", {projectName, url, userId});



/**
 * 移除登陆凭证
 * @param {string} id 
 */
export const removeSession = (id) => del("/session/" + id);

/**
 * 添加登陆凭证
 * @param {string} username 
 * @param {string} pwdMd5 
 */
export const addSession = (username, pwdMd5) => post("/session", {username, pwdMd5});

// TODO:export const updateUser = (id, username, pwdMd5) => put()

/**
 * 移除用户
 * @param {long} id 
 */
export const delUser = (id) => del("/user/" + id);

/**
 * 增加用户
 * @param {*} id 
 * @param {*} username 
 * @param {*} pwdMd5 
 */
export const addUser = (id, username, pwdMd5) => post("/user", {id, username, pwdMd5});

/**
 * 更新点的相关信息
 * @param {*} projectId 
 * @param {*} vertexId 
 * @param {*} vertexVo 
 */
export const putVertex = (projectId, vertexId, vertexVo) => put("/project/" + projectId + "/vertex/" + vertexId + "/dynamic", vertexVo);
