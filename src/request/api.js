import { get, post, del, put } from './http'
/**
 * 
 * @param {long} id 
 * @param {string} username 
 * @param {string} pwdMd5 
 */
export const admin = (id, username, pwdMd5) => post("/admin", { id, username, pwdMd5 });
export const similarFunction = (projectId, funcName) => get("/project/" + projectId + "/similarFunction", funcName);

/**
 * 添加管理员登录凭证
 * @param {string} username 
 * @param {string} pwdMd5 
 */
export const adminSession = (username, pwdMd5) => post("/adminSession", { username, pwdMd5 });

/**
 * 查询子图最短路
 * @param {long} projectId 
 * @param {long} subgraphId 
 * @param {long} startVertexId 
 * @param {long} endVertexIndex 
 */
export const subgraphShortestPath = (projectId, subgraphId, startVertexId, endVertexIndex) => get("/project/" + projectId + "/subgraph/" + subgraphId + "/subgraphShortestPath", { startVertexId, endVertexIndex });

/**
 * 查询原图最短路
 * @param {long} projectId 
 * @param {long} startVertexId 
 * @param {long} endVertexId 
 */
export const originalGraphShortestPath = (projectId, startVertexId, endVertexId) => get("/project/" + projectId + "/originalGraphShortestPath", { startVertexId, endVertexId });

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
export const addSubgraph = (projectId, threshold, name) => post("/project/" + projectId + "/subgraph?threshold=" + threshold + "&name=" + name, null);

/**
 * 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
 * @param {long} userId 
 */
export const getProjectsSingle = (userId) => get("/project?userId=" + userId);

/**
 * 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
 * @param {long} userId 
 */
export const getProjectsAll = () => get("/project");

/**
 * 根据项目id查寻项目
 * @param {long} projectId 
 */
export const getProject = (projectId) => get("/project/" + projectId);

/**
 * 移除项目
 * @param {long} id 
 */
export const delProject = (id) => del("/project/" + id);

/**
 * 添加项目
 * @param {string} projectName 
 * @param {string} url 	git仓库的url
 * @param {string} userId 
 */
export const addProject = (projectName, url, userId) => post("/project?projectName=" + projectName + "&url=" + url + "&userId=" + userId + "&groupId=-1", null);



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
export const addSession = (username, pwdMd5) => post("/session", { username, pwdMd5 });

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
export const addUser = (id, username, pwdMd5) => post("/user", { id, username, pwdMd5 });

/**
 * 更新点的相关信息
 * @param {*} projectId 
 * @param {*} vertexId 
 * @param {*} vertexVo 
 */
export const putVertex = (projectId, vertexId, vertexVo) => put("/project/" + projectId + "/vertex/" + vertexId + "/dynamic", vertexVo);

/**
 * 更新边的相关信息
 * @param {*} projectId 
 * @param {*} edgeId 
 * @param {*} edgeVo 
 */
export const putEdge = (projectId, edgeId, edgeVo) => put("/project/" + projectId + "/edge/" + edgeId + "/dynamic", edgeVo);

/**
 * 从原图中搜索路径
 * @param {} projectId 
 * @param {*} startVertexId 
 * @param {*} endVertexId 
 */
export const getOriginalGraphPath = (projectId, startVertexId, endVertexId) => get("/project/" + projectId + "/originalGraphPath?startVertexId=" + startVertexId + "&endVertexId=" + endVertexId, null);

/**
 * 设置连通域
 * @param {*} projectId 
 * @param {*} subgraphId 
 * @param {*} domainId 
 * @param {*} domainVo 
 */
export const putConnectiveDomain = (projectId, subgraphId, domainId, domainVo) => put("/project/" + projectId + "/subgraph/" + subgraphId + "/connectiveDomain/" + domainId + "/dynamic", domainVo);

/**
 * 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
 * @param {*} userId 
 */
export const getProjectBasicAttributeSingle = (userId) => get("/project?userId=" + userId);

/**
* 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
* @param {*} userId 
*/
export const getProjectBasicAttributeAll = () => get("/project");

/**
 * 获取全部用户
 */
export const getAllUsers = () => get("/user");

/**
 * 获取某个项目的统计信息
 * @param {*} projectId 
 */
export const getProjectProfile = (projectId) => get("project/" + projectId + "/profile");

/**
 * 管理员登录
 * @param {*} usrName 
 * @param {*} pwd 
 */
export const postAdmin = (usrName, pwd) => post("/adminSession", { username: usrName, pwdMd5: pwd });

/**
 * 管理员注册
 * @param {*} username 
 * @param {*} pwd 
 * @param {*} inviteCode 
 */
export const addAdmin = (username, pwd, inviteCode) => post("/admin", { id: null, username: username, pwdMd5: pwd, inviteCode: inviteCode });

/**
 * 更新项目名
 * @param {*} projectId 
 * @param {*} projectName 
 */
export const putProject = (projectId, projectName) => put("/project/" + projectId + "/dynamic", { id: projectId, projectName: projectName });

/**
 * 移动连通域
 * @param {*} projectId 
 * @param {*} domainId 
 * @param {*} dx 
 * @param {*} dy 
 */
export const putConnectiveDomainPosition = (projectId, domainId, dx, dy) => put("/project/" + projectId + "/connectiveDomain/" + domainId + "/position?relativeX=" + dx + "&relativeY=" + dy);

/**
 * 获得所有小组信息，传回列表
 * @param {*} userId 
 */
export const getAllGroup = (userId) => get("/group/getgroup/" + userId);

/**
 * 获得某个小组的全部成员
 * @param {*} groupId 
 */
export const getMembers = (groupId) => get("/group/getuser/" + groupId);


/**
 * 获取联系人列表
 * @param {*} userId 
 */
export const getContacts = (userId) => get("/contact/" + userId);

/**
 * 获取两人之间发送的的所有消息
 * @param {*} userId 
 * @param {*} toUserId 
 */
export const getMessages = (userId, toUserId) => get("/message?senderId=" + userId + "&receiverId=" + toUserId);

/**
 * 创建小组
 * @param {*} group 
 */
export const postGroup = (group) => post("/group", group);

/**
 * 添加某个组员到小组
 * @param {*} groupId 
 * @param {*} userId 
 * @param {*} inviteCode 
 */
export const postMember = (groupId, userId, inviteCode) => post("/group/" + groupId + "/add/" + userId + "?inviteCode=" + inviteCode);

/**
 * 修改组员权限
 * @param {*} groupId 
 * @param {*} userId 
 * @param {*} level 
 */
export const putMember = (groupId, userId, level) => put("/group/" + groupId + "/authority/" + userId + "?level=" + level);

export const API = {
    /**
     * 删除组员
     * @param {*} groupId 
     * @param {*} userId 
     */
    deleteMember: (groupId, userId) => del("/group/" + groupId + "/remove/" + userId),

    /**
     * 删除小组
     */
    deleteGroup: (groupId) => del("/group/" + groupId),


    /**
     * 获取小组公告
     * @param {*} groupId 
     */
    getNotice: (groupId) => get("/group/notice/" + groupId),

    /**
     * 添加公告
     */
    postNotice: (notice) => post("/group/notice", notice),

    /**
     * 修改顶点位置
     */
    putVertexPosition: (projectId, vertexPositionDynamicVo) => put("/project/" + projectId + "/subgraph/" + vertexPositionDynamicVo.subgraphId + "/vertex/" + vertexPositionDynamicVo.id + "/position", vertexPositionDynamicVo),

    /**
     * 获取小组所有任务
     */
    getAllTask: (groupId) => get("/task/" + groupId),

    /**
     * 获取任务的所有执行者
     * @returns {List<Long>} 执行者的id列表
     */
    getAllExecutor: (taskId) => get("/task/executor/" + taskId),

    /**
     * 更新任务（不包含执行者）
     */
    putTask: (taskVo) => put("/task/", taskVo),

    /**
     * 更新执行者
     * @param {List<Long>} userIds
     */
    updateExecutor: (groupId, taskId, userIds) => post("/task/" + groupId + "/" + taskId, userIds), 

    /**
     * 添加任务
     */
    postTask: (taskVo) => post("/task", taskVo),

    /**
     * 创建小组项目
     */
    postProject_user: (projectName, url, userId) => post("/project?projectName=" + projectName + "&url=" + url + "&userId=" + userId + "&groupId=-1", null),

    /**
     * 创建小组项目
     */
    postProject_group: (projectName, url, groupId) => post("/project?projectName=" + projectName + "&url=" + url + "&userId=-1&groupId=" + groupId, null),

    /**
     * 创建项目
     */
    postProject: (projectName, url, userId, groupId) => post("/project?projectName=" + projectName + "&url=" + url + "&userId=" + userId + "&groupId=" + groupId, null),

    /**
     * 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
     * @param {long} userId 
     */
    getProjectBasicAttribute_user: (userId) => get("/project?userId=" + userId),

      /**
     * 获取所有项目的名称等动态信息，如果传了用户id，就是返回该用户的所有项目，否则返回所有项目
     * @param {long} userId 
     */
    getProjectBasicAttribute: () => get("/project"),

    getProjectBasicAttribute_group: (groupId) => get("/project?groupId=" + groupId),

    /**
     * 有新消息则返回true
     */
    getContactNew: (userId) => get("/contact/" + userId + "/new"),

   

}

