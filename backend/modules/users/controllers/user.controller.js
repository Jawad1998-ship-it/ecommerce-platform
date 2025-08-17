import db from "../../../config/database.config.js";
import errorResponse from "../../../utils/errorResponse.js";
import successResponse from "../../../utils/successResponse.js";
import { updateProfile, updatePassword } from "./userSettings.controller.js";

const User = db.model.User;

export const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;

    const { count, rows: data } = await User.findAndCountAll({
      include: [
        {
          model: Role,
          attributes: ["name", "info"],
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    if (count > 0) {
      successResponse(200, "OK", { data, totalRows: count }, res);
    } else {
      res.send({ message: "No User Found!" });
    }
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while Finding User",
      res
    );
  }
};

export const findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const userQuery = await User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Role,
          attributes: ["name", "info"],
        },
      ],
    });

    if (userQuery) {
      const rolePermissionsQuery = await RolePermission.findAll({
        where: {
          role: userQuery.role,
        },
        attributes: ["module_id", "activity_id"],
      });

      if (rolePermissionsQuery) {
        const userQueryData = {
          userQuery,
          permissions: rolePermissionsQuery,
        };
        res.status(200).send({
          status: "1",
          message: `Found User with id=${id} Successfully!!`,
          data: userQueryData,
        });
      }
    } else {
      res.status(404).send({
        message: `Cannot find User with id=${id}.`,
      });
    }
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while Finding User",
      res
    );
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;
    const query = await User.findByPk(id);
    if (query) {
      if (userData) {
        const updateDoc = {
          role: userData.role,
          f_name: userData.f_name,
          l_name: userData.l_name,
          mobile: userData.mobile,
          email: userData.email,
          date_of_birth: userData.date_of_birth,
          contact_person: userData.contactPerson,
          nid: userData.nid,
          address_1: userData.address1,
          address_2: userData.address2,
          pregnancyField: userData.pregnancyField,
          SMSChecked: userData?.SMSChecked,
          credit_limit: userData.credit_limit,
          commission_rate: userData.commission_rate,
          remarks: userData.remarks,
          status: userData.status,
        };

        const updateDetailsDoc = {
          gender_id: userData?.gender_id,
          country_id: userData?.country_id,
        };

        if (userData.image) {
          updateDoc.image = userData.image;
        }
        if (userData.finger_print) {
          updateDoc.finger_print = userData.finger_print;
        }

        const data = await User.update(updateDoc, {
          where: {
            id: id,
          },
        });
        if (data) {
          await UserDetails.update(updateDetailsDoc, {
            where: {
              user_id: id,
            },
          });
        }
        return res.status(200).send({
          status: "success",
          message: "User updated successfully",
          data: data,
        });
      } else {
        return res.send({
          status: "error",
          message: "Required Fields Cannot be Empty!!!",
        });
      }
    } else {
      return res.status(404).send({
        message: `Cannot find User with id=${req.params.id}.`,
      });
    }
  } catch (err) {
    errorResponse(
      500,
      "ERROR",
      err.message || "Some error occurred while Updating User",
      res
    );
  }
};

export const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;

    const query = await User.findByPk(id);
    if (query) {
      const userInfoQuery = await UserDetails.findOne({
        where: {
          user_id: id,
        },
      });
      if (userInfoQuery) {
        const result = await User.destroy({
          where: {
            id: id,
          },
        });
        await UserDetails.destroy({
          where: {
            user_id: id,
          },
        });

        return res.send({
          data: result,
          message: "User deleted Successfully!",
        });
      } else {
        const result = await User.destroy({
          where: {
            id: id,
          },
        });
        return res.send({
          data: result,
          message: "User deleted Successfully!",
        });
      }
    } else {
      res.send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
      });
    }
  } catch (err) {
    errorHandler(
      500,
      "ERROR",
      err.message || "Some error occurred while Deleting the User.",
      res
    );
  }
};

export const uploadImage = async (req, res) => {
  try {
    let imageFiles = req.file;

    res.send(imageFiles);
  } catch (err) {
    errorHandler(
      500,
      "ERROR",
      err.message ||
        "Some error occurred while Finding Users By Date_of_Birth.",
      res
    );
  }
};

// Export the settings controller methods
export { updateProfile, updatePassword };
