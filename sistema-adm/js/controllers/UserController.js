class UserController{
    constructor(){
        this.addEventBtns();
        this.users = {}
        this.start();
        this.login;
    }

    start(){
        if(!localStorage.getItem('users')){
            localStorage.setItem('users','{}')
        }
        this.users = JSON.parse(localStorage.getItem('users'))
    }

    addLine(user){
        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(user)
        tr.innerHTML = `
        <td class='table-id'>${user.getId()}</td>
        <td class='table-icon'><img src='${user.getPhoto()}' alt='Ícone'></td>
        <td class='table-name'>${user.getName()}</td>
        <td class='table-email'>${user.getEmail()}</td>
        <td class='table-phone'>${user.getPhone()}</td>
        <td class='table-date'>${user.getDate()}</td>`;
        if(user.getAdmin()){
            tr.innerHTML+=`<td class='table-admin'>Sim</td>`
        }else{
            tr.innerHTML+=`<td class='table-admin'>Não</td>`
        }
        tr.innerHTML+=`
        <td class='table-actions'>
            <span class="material-icons-sharp edit-btn">edit</span>
            <span class="material-icons-sharp delete-btn">delete</span>
        </td>`;
        document.querySelector('.users tbody').appendChild(tr);

        document.querySelectorAll('.edit-btn')[document.querySelectorAll('.edit-btn').length-1].addEventListener('click',()=>{
            document.querySelector('.form-edit').style.display = 'flex';

            let userObj = JSON.parse(tr.dataset.user);
            let user = new User(userObj._id,userObj._name,userObj._photo,userObj._email,userObj._phone,userObj._admin,userObj._password);
            let formEl = document.querySelector('form.edit');
            let elements = formEl.elements;
            elements.id.value = user.getId();
            elements.name.value = user.getName();
            elements.email.value = user.getEmail();
            elements.phone.value = user.getPhone();
            elements.admin.checked = user.getAdmin();
        })

        document.querySelectorAll('.delete-btn')[document.querySelectorAll('.delete-btn').length-1].addEventListener('click',()=>{
            if(confirm('Deseja deletar o usuário?')){
                let userObj = JSON.parse(tr.dataset.user);
                let user = new User(userObj._id,userObj._name,userObj._photo,userObj._email,userObj._phone,userObj._admin,userObj._password);
                delete this.users[user.getId()];
                localStorage.setItem('users',JSON.stringify(this.users))
                tr.replaceWith('');
                if(this.login.getId()==user.getId()){
                    alert('Faça o login com outro usuário!')
                    this.logout()
                }
            }
        })
    }

    readPhoto(data){
        return new Promise((resolve,reject)=>{
            let fr = new FileReader();
            fr.addEventListener('load',()=>{
                resolve(fr.result);
            });
            fr.addEventListener('error',(e)=>{
                reject(e)
            })
            fr.readAsDataURL(data);
        })
    }

    attUsers(key,value){
        this.users[key] = value;
        localStorage.setItem('users', JSON.stringify(this.users))
    }

    register(){
        let formEl = document.querySelector('.register');
        let elements = formEl.elements;
        let user;
        let registerData = {};
        [...elements].forEach((v)=>{
            switch(v.type){
                case 'checkbox':
                    registerData.admin = v.checked
                break;
                case 'file':
                break;
                default:
                    registerData[v.name] = v.value
                break;
            }
        })
        if(JSON.stringify(this.users) == JSON.stringify({})){
            user = new User(0,registerData.name,'',registerData.email,registerData.phone,registerData.admin,registerData.password);
        }else{
            //definir lista de usuarios
            let lastUserObj = Object.values(this.users)[Object.values(this.users).length-1];
            let lastUser = new User(lastUserObj._id,lastUserObj._name,lastUserObj._photo,lastUserObj._email,lastUserObj._phone,lastUserObj._admin,lastUserObj._password)
            user = new User(lastUser.getId()+1,registerData.name,'',registerData.email,registerData.phone,registerData.admin,registerData.password);
            if(lastUser.getId()=='mestre'){
                if(Object.values(this.users).length==1){
                    user = new User(0,registerData.name,'',registerData.email,registerData.phone,registerData.admin,registerData.password);
                }else{
                    let lastUserObj = Object.values(this.users)[Object.values(this.users).length-2];
                    let lastUser = new User(lastUserObj._id,lastUserObj._name,lastUserObj._photo,lastUserObj._email,lastUserObj._phone,lastUserObj._admin,lastUserObj._password)
                    user = new User(lastUser.getId()+1,registerData.name,'',registerData.email,registerData.phone,registerData.admin,registerData.password);
                }
            }
        }
        let fileEl = elements.photo;
        if(!this.verifEmail(user)){
            alert('E-mail já cadastrdo.')
            return
        }
        if(fileEl.files.length == 0){
            user.setPhoto('img/icon.jpg');
            this.attUsers(user.getId(),user)
            this.addLine(user)
            this.closeForm(document.querySelector('form.register'),document.querySelector('.form-add'))
        }else{
            this.readPhoto(fileEl.files[0]).then((result)=>{
                user.setPhoto(result)
                this.attUsers(user.getId(),user)
                this.addLine(user)
                this.closeForm(document.querySelector('form.register'),document.querySelector('.form-add'))
            },(e)=>{
                console.error(e)
            })
        }
    }

    verifEmail(user){
        let verifEmail = Object.values(this.users).filter((v)=>{
            let user2 = new User(v._id,v._name,v._photo,v._email,v._phone,v._admin,v._password)
            if(user2.getEmail()==user.getEmail() && user2.getId()!=user.getId()){
                return v;
            }
        })
        if(verifEmail.length>0){
            return false;
        }else{
            return true;
        }
    }

    closeForm(form, formContainer){
        form.reset();
        formContainer.style.display = 'none'
    }

    attRows(tr,user){
        tr.dataset.user = JSON.stringify(user)
        tr.querySelector('.table-icon img').src = user.getPhoto()
        tr.querySelector('.table-name').innerHTML = user.getName()
        tr.querySelector('.table-email').innerHTML = user.getEmail()
        tr.querySelector('.table-phone').innerHTML = user.getPhone()
        if(user.getAdmin()){
            tr.querySelector('.table-admin').innerHTML = 'Sim'
        }else{
            tr.querySelector('.table-admin').innerHTML = 'Não'
        }
    }

    edit(){
        let formEl = document.querySelector('form.edit');
        let elements = formEl.elements;

        let selectedUser = [...document.querySelectorAll('.users tr:not(:first-child)')].filter((v)=>{
            if(JSON.parse(v.dataset.user)._id == elements.id.value){
                return v;
            }
        })

        let userObj = JSON.parse(selectedUser[0].dataset.user);
        userObj._name = elements.name.value
        userObj._email = elements.email.value
        userObj._phone = elements.phone.value
        userObj._admin = elements.admin.checked
        let user = new User(userObj._id,userObj._name,'',userObj._email,userObj._phone,userObj._admin,userObj._password);
        
        if(!this.verifEmail(user)){
            alert('E-mail já cadastrdo.')
            return
        }

        let files = elements.photo.files;
        if(files.length == 0){
            user.setPhoto(userObj._photo)
            this.attUsers(user.getId(),user)
            this.attRows(selectedUser[0],user)
            this.closeForm(document.querySelector('form.edit'),document.querySelector('.form-edit'))
        }else{
            this.readPhoto(files[0]).then((result)=>{
                user.setPhoto(result)
                this.attUsers(user.getId(),user)
                this.attRows(selectedUser[0],user)
                this.closeForm(document.querySelector('form.edit'),document.querySelector('.form-edit'))
            },(e)=>{
                console.error(e)
            })
        }
    }

    addEventBtns(){
        document.querySelector('.add').addEventListener('click',()=>{
            document.querySelector('.form-add').style.display = 'flex'
        })

        document.querySelectorAll('.close')[0].addEventListener('click',()=>{
            this.closeForm(document.querySelector('form.register'),document.querySelector('.form-add'))
        })
        document.querySelectorAll('.check')[0].addEventListener('click',()=>{
            this.register();
        })

        document.querySelectorAll('.close')[1].addEventListener('click',()=>{
            this.closeForm(document.querySelector('form.edit'),document.querySelector('.form-edit'))
        })
        document.querySelectorAll('.check')[1].addEventListener('click',()=>{
            this.edit();
        })

        document.querySelector('.logout').addEventListener('click',()=>{
            this.logout()
        })
    }
}