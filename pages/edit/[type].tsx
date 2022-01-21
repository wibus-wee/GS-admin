/*
 * @FilePath: /GS-admin/pages/edit/[type].tsx
 * @author: Wibus
 * @Date: 2022-01-21 13:13:51
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-21 16:46:06
 * Coding With IU
 */

import { Breadcrumb, Button, InputTag, Layout, Message, Select } from "@arco-design/web-react";
import { IconCaretRight, IconCaretLeft } from "@arco-design/web-react/icon";
import { Form, Input, Checkbox } from '@arco-design/web-react';
import { NextPage } from "next";
import Router from "next/router";
import { useState } from "react";
import { useMount } from "react-use";
import Side from "../../components/Side";
import $axios from "../../utils/request";


class propClass {
  data!: {
    id: number | undefined;
    prop: string | undefined; //临时存储
    title: string | undefined;
    path: string | undefined;
    content: string | undefined;
    tags: string | undefined;
    slug: string | undefined;
  }
  where: string | undefined
}

const Edit: NextPage = (props) => {

  const Header = Layout.Header;
  const Footer = Layout.Footer;
  const Content = Layout.Content;
  const FormItem = Form.Item;

  // 设置状态
  const [collapsed, setCollapsed] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);  

  let prop = props as propClass;
  // console.log(prop);

  useMount(() => {
    if (prop.data && prop.data.id === undefined){
      if (prop.data.prop == 'PathYes') {
        Message.info("无法获得信息，正在返回首页");
        Router.push("/");
      }
    }
    console.log(prop.where);
    
    $axios.get("category/list?list").then(res => {
      // res.data 内每一个对象的slug和name单独取出为一个对象并组成数组
      let arr = res.data.map((item: { slug: any; name: any; }) => {
        return {
          slug: item.slug,
          name: item.name
        }
      })
      // console.log(arr);
      setCategoryList(arr);
    })
  });
  return (
  <>
  <Layout className='layout-collapse arco-layout-has-sider'>
        <Side
          collapsed={collapsed}
        />
        <Layout>
          <Header>
            <Button shape='round' className='trigger' onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <IconCaretRight /> : <IconCaretLeft />}
            </Button>
          </Header>
          <Layout style={{ padding: '0 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>
            <Content >
              <Form 
              style={{ width: '100%', marginLeft: 100, marginTop:30}}
              autoComplete="off"
              onSubmit={(e) => {
                // 将e.tags 转换为,
                if (e.tags) {
                  e.tags = e.tags.join(',');
                }
                console.log(e);
                const SendWhere = e.SendWhere;
                delete e.SendWhere;
                console.log(SendWhere)
                const where = prop.data ? prop.data.path ? 'update' : 'send' : 'send';
                $axios.post(`/${SendWhere}/${where}`, e).then(() => {
                  Message.success('提交成功');
                  Router.push("/")
                  Router.push(`/edit/${SendWhere}?path=` + e.path);
                }).catch((err) => {
                  console.log(err)
                  Message.error('提交失败');
                })
              }}
              >
                <FormItem 
                field="id"
                initialValue={prop.data ? prop.data.id : undefined}
                disabled
                hidden
                style={{display: 'none'}}
                >
                  <Input name='id' hidden/>
                </FormItem>

                <FormItem 
                field="SendWhere"
                initialValue={prop.where ? prop.where : "posts"}
                disabled
                hidden
                style={{display: 'none'}}
                >
                  <Input name='SendWhere' hidden/>
                </FormItem>

                <FormItem 
                // label='Title'
                field='title'
                initialValue={prop.data ? prop.data.title : undefined}
                >
                  <Input placeholder='Title...'required/>
                </FormItem>
                <FormItem
                  // label='Path'
                  field='path'
                  initialValue={prop.data ? prop.data.path : undefined}
                >
                  <Input placeholder='Path...' required />
                </FormItem>

                <FormItem 
                // label='Content'
                field='content'
                initialValue={prop.data ? prop.data.content : undefined}
                >
                  <Input.TextArea 
                  placeholder='Content...'
                  style={{height: 250}}
                  required />
                </FormItem>

                <FormItem 
                field={prop.where=="post" ? "tags" : undefined}
                initialValue={prop.data ? prop.data.tags ? prop.data.tags.split(',') : [] : []}
                style={{display: prop.where=="post" ? 'block' : 'none'}}
                >
                  <InputTag 
                  allowClear
                  placeholder='Tags'
                  />
                </FormItem>                

                <FormItem 
                field={prop.where=="post" ? "slug" : undefined}
                initialValue={prop.data ? prop.data.slug : undefined}
                // style={{width: '300px' }}
                style={{display: prop.where=="post" ? 'block' : 'none'}}
                >
                  <Select 
                  placeholder="Slug">
                    {
                      
                    categoryList.map((option, index) => (
                    <Select.Option key={option.slug} disabled={index === 3} value={option.slug}>
                      {option.name}
                    </Select.Option>
                  ))
                  }

                  </Select>
                </FormItem>

                <FormItem>
                  <Button type='primary' htmlType="submit">Submit</Button>
                </FormItem>
              </Form>
            </Content>
            <Footer>GS-admin Beta</Footer>
          </Layout>
        </Layout>
      </Layout>
  </>
  );
}

Edit.getInitialProps = async (ctx) => {
  const { path, type } = ctx.query;
  let res: any
  if (type !== "posts" && type !== "pages") {
    return {
      id: undefined,
      prop: 'PathYes',
      where: type
    }
  }
  if (path) {
    res = await $axios.get(`/${type}/${path}`)
    return res.data ? 
    {
      data: res.data,
      where: type
    } : {
      id:undefined,
      prop: path ? 'PathYes': 'PathNo',
      where: type
    }
  };
  return {
    id:undefined,
    prop:path ? 'PathYes': 'PathNo',
    where: type};
}


export default Edit