import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
// import LinkButton from 'components/Table/LinkButton';
import { listOrganizationGroups, listOrganizationUsers, getOrgUsersByGroupByActive, getOrgUsersByRoleByOrg } from 'graphql/queries';
import { userOperation } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';
import rolesMenu from 'constants/roles';
import DetailFormDialog from 'components/DetailFormDialog';
import UserAvatar from 'components/UserAvatar';
import formMetadata from 'forms/UserOperation';

function OrganizationUserTable({
  title = '人員列表',
  description,
  organizationId,
  groupId,
  username: inQueryUsername,
  roles,
  nested,
  hide = [],
}) {
  const [data, setData] = useState([]);
  const [groupsMenu, setGroupsMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [open, setOpen] = useState(false);

  const options = {};

  const columns = [
    {
      name: 'username',
      label: ' ',
      options: {
        display: true,
        filter: false,
        sort: false,
        customBodyRender(item) {
          return (<UserAvatar username={item} />);
        },
      },
    },
    {
      name: 'isActive',
      label: '使用中',
      type: 'checkbox',
      edit: {
        type: 'checkbox',
      },
      options: {
        display: true,
        filter: true,
        sort: true,
      },
    },
    {
      name: 'role',
      label: '職位',
      isTemplate: true,
      edit: {
        type: 'select',
        menu: rolesMenu,
      },
      options: {
        display: true,
        filter: true,
        sort: true,
        customBodyRender(item) {
          const matched = rolesMenu.find(({ value }) => value === item);
          return matched ? matched.label : item;
        },
      },
    },
    {
      name: 'groupId',
      label: '班級',
      edit: {
        type: 'select',
        menu: groupsMenu,
      },
      options: {
        display: true,
        filter: true,
        sort: true,
        customBodyRender(item) {
          const matched = groupsMenu.find(({ value }) => value === item);
          return matched ? matched.label : item;
        },
      },
    },
    {
      name: 'username',
      label: '帳號',
      isTemplate: true,
      options: {
        display: true,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'idNumber',
      label: '學號',
      isTemplate: true,
      edit: {
        type: 'text',
      },
      options: {
        display: true,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'name',
      label: '名字',
      isTemplate: true,
      edit: {
        type: 'text',
      },
      options: {
        display: true,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'email',
      label: 'Email',
      edit: {
        type: 'text',
      },
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'currentPoints',
      label: '目前點數',
      type: 'point',
      options: {
        display: true,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'earnedPoints',
      label: '總點數',
      type: 'point',
      options: {
        display: true,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'createdBy',
      label: '創立者',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'updatedBy',
      label: '更新者',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'createdAt',
      label: '創立於',
      type: 'datetime',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'updatedAt',
      label: '更新於',
      type: 'datetime',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    // {
    //   name: 'id',
    //   label: ' ',
    //   options: {
    //     display: true,
    //     filter: false,
    //     sort: false,
    //     customBodyRender(username) {
    //       return (
    //         <LinkButton
    //           path={`/organizationUser/${username}`}
    //           label="前往使用者專頁"
    //         />
    //       );
    //     },
    //   },
    // },
  ];

  const onUpate = async (item, dataIndex) => {
    const user = {
      organizationId: item.organizationId,
      username: item.username,
    };
    columns.forEach(({ name, edit }) => {
      if (edit) {
        user[name] = item[name];
      }
    });

    user.isActive = user.isActive ? 1 : 0;

    console.log(user);

    // await request(updateOrganizationUser, { input });
    await request(userOperation, { input: { users: [user] } });

    Object.assign(data[dataIndex], user);
    setData([...data]);
  };

  const onCreate = async (newRecord) => {
    try {
      setIsLoading(true);
      const user = Object.assign(newRecord, {
        idNumber: newRecord.idNumber || 'N/A',
      });
      await request(userOperation, { input: { users: [user] } });

      setOpen(false);
      setLastUpdatedAt(Date.now());
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  // const onBatchAdd = async (items) => {
  //   try {
  //     setIsLoading(true);
  //     const users = items.map((item) => {
  //       return Object.assign(item, {
  //         organizationId,
  //         isActive: 1,
  //         idNumber: item.idNumber || 'N/A',
  //         // currentPoints: +(parseFloat(item.currentPoints || 0) * 100),
  //         // earnedPoints: +(parseFloat(item.earnedPoints || 0) * 100),
  //       });
  //     });

  //     await request(userOperation, { input: users });
  //     setLastUpdatedAt(Date.now());
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!organizationId && !groupId) return;

    (async () => {
      try {
        setIsLoading(true);

        let records = [];
        if (groupId) {
          records = (await asyncListAll(getOrgUsersByGroupByActive, { groupId }));
        } else
        if (organizationId) {
          if (roles && roles.length > 0) {
            const promises = roles.map(async (role) => {
              const results = await asyncListAll(getOrgUsersByRoleByOrg, {
                role,
                organizationId: { eq: organizationId },
              });
              records = [...records, ...results];
            });
            await Promise.all(promises);
          } else {
            const params = { organizationId };
            if (inQueryUsername) {
              params.username = { eq: inQueryUsername };
            }
            records = (await asyncListAll(listOrganizationUsers, params));
          }
        }

        setData(records
          .sort(sortBy('name'))
          .sort(sortBy('role'))
          .sort(sortBy('isActive', true))
          .sort(sortBy('groupId')));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, groupId, roles, inQueryUsername, lastUpdatedAt]);

  useEffect(() => {
    if (!organizationId && !groupId) return;

    (async () => {
      let records = [];
      if (groupId) {
        records = (await asyncListAll(listOrganizationGroups, { organizationId, id: { eq: groupId } }));
      } else {
        records = (await asyncListAll(listOrganizationGroups, { organizationId }));
      }

      setGroupsMenu(records.sort(sortBy('name')).map(({ id, name }) => {
        return { label: name, value: id };
      }));
    })();
  }, [organizationId, groupId]);

  return (
    <React.Fragment>
      <Table
        title={title}
        isLoading={isLoading}
        description={description}
        data={data}
        columns={columns}
        hide={hide}
        options={options}
        nested={nested}
        onAddItem={() => setOpen(true)}
        // onBatchAdd={onBatchAdd}
        onUpdateItem={onUpate}
        onRefresh={() => setLastUpdatedAt(Date.now())}
      />
      {open &&
        <DetailFormDialog
          title="新增使用者"
          openOnInit={true}
          onClose={() => setOpen(false)}
          // details form props
          data={{
            organizationId: localStorage.getItem('app:organizationId'),
            role: roles ? roles[0] : undefined,
            groupId,
          }}
          metadata={formMetadata(groupsMenu)}
          isLoading={isLoading}
          onSubmit={onCreate}
        />}
    </React.Fragment>
  );
}

OrganizationUserTable.propTypes = {
  organizationId: PropTypes.string,
  groupId: PropTypes.string,
  username: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  nested: PropTypes.bool,
  roles: PropTypes.array,
  hide: PropTypes.array,
};

export default OrganizationUserTable;
