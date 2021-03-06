'use strict';

const Service = require('egg').Service;

/**
 * Service - 类别
 * @class
 * @author ruiyong-lee
 */
class GoodsCategoryService extends Service {
  /**
   * 新增类别
   * @param {Object} params 条件
   * @return {String|Null} 类别uuid
   */
  async saveNew(params = {}) {
    let { goodsCategory, userUuid, userName } = params;
    const { app } = this;
    const crateInfo = app.getCrateInfo(userUuid, userName);

    goodsCategory = { ...goodsCategory, ...crateInfo, orgUuid: userUuid };

    return await app.model.GoodsCategory.saveNew(goodsCategory);
  }

  /**
   * 修改类别
   * @param {Object} params 条件
   * @return {String|Null} 类别uuid
   */
  async saveModify(params = {}) {
    const { app } = this;
    let { goodsCategory, userUuid, userName } = params;
    const { version } = goodsCategory;
    const modifyInfo = app.getModifyInfo(version, userUuid, userName);

    goodsCategory = { ...goodsCategory, ...modifyInfo };

    return await app.model.GoodsCategory.saveModify(goodsCategory);
  }

  /**
   * 删除类别
   * @param {Object} uuid 类别uuid
   * @return {String|Null} 删除类别uuid
   */
  async delete(uuid) {
    const { app } = this;
    await app.model.GoodsCategory.delete(uuid);

    return uuid;
  }

  /**
   * 获取类别分页列表
   * @param {Object} params 条件
   * @return {Object|null} 查找结果
   */
  async query(params = {}) {
    const { app } = this;
    return await app.model.GoodsCategory.query({
      ...params,
      attributes: ['uuid', 'version', 'name', 'createdTime', 'lastModifiedTime'],
    });
  }

  /**
   * 根据uuid获取类别
   * @param {Object} uuid 类别uuid
   * @return {Object|null} 查找结果
   */
  async get(uuid) {
    const { app } = this;
    return await app.model.GoodsCategory.get({
      uuid,
      attributes: ['uuid', 'version', 'name', 'createdTime', 'lastModifiedTime'],
    });
  }
}

module.exports = GoodsCategoryService;
