const HOOK = require("../../src/HookManager.js");
const CLASS = require("../../src/CoreClass.js");
const Inspector = require("../../src/Inspector.js");
const Event = require("../../src/Event.js");
const Logger = require("../../src/Logger.js");
const ut = require("../../src/Utils.js");


// ===== INIT =====

var DynLoaderInspector = new Inspector.Inspector({
    hookSet: new HOOK.HookSet({
        id: "DynamicLoader",
        name: "Dynamic class loader inspector",
        description: "Update the application representation with Custom classloader and reflection data"
    })
});

DynLoaderInspector.useGUI();

// ===== CONFIG HOOKS =====

DynLoaderInspector.hookSet.require("Reflect");

// add callback
/*
DynLoaderInspector.hookSet.addPrologue(`
    var @@__CTX__@@_invokeHooked = false;
    var meth_47fc55b2d470b2b68bef852491d2c0d8 = CLS.java.lang.reflect.Method.invoke.overload('java.lang.Object','[Ljava.lang.Object;');
    
    function @@__CTX__@@_startInvokeHooking(){

        meth_47fc55b2d470b2b68bef852491d2c0d8.implementation = function(arg0,arg1) {

            var param = DEXC_MODULE.reflect.castArray( 
                DEXC_MODULE.common.class.java.lang.Object,
                arg1 );

            var paramCls = [], cls = null;

            for(var i in param){
                cls = Java.cast( param[i].getClass(), CLS.java.lang.Class);
                paramCls.push( cls.getName());
            }

            // thisRef: arg0.hashcode(),
            
                          
            send({ id:"ZDI5YmYxN2Y5YjViZjlhMDAzYmJjZDUwZjU1MjAxMzI=", 
                msg:"java.lang.reflect.Method.invoke([]) target", 
                data:{
                    method: DEXC_MODULE.reflect.getMethodSignature(this, this.getParameterTypes()),
                    param: paramCls,
                    before:1
                }, 
                action:"None before", after:false  });
            
            var ret = meth_47fc55b2d470b2b68bef852491d2c0d8.call(this, arg0, arg1);

            if(isIntanceOf(ret,"java.lang.String")){
                var str = Java.cast(ret, DEXC_MODULE.common.class.java.lang.String);
                send({ id:"ZDI5YmYxN2Y5YjViZjlhMDAzYmJjZDUwZjU1MjAxMzI=", 
                msg:"java.lang.reflect.Method.invoke([]) after", 
                data:{
                    ret:str.toString(),
                    before:0
                }, action:"None before", after:true  });
            }else{
                send({ id:"ZDI5YmYxN2Y5YjViZjlhMDAzYmJjZDUwZjU1MjAxMzI=", 
                msg:"java.lang.reflect.Method.invoke([]) after", 
                data:{
                    ret:"[Object]",
                    before:0
                }, action:"None before", after:true  });
            }

            
            return ret; 
        };

        @@__CTX__@@_invokeHooked = true;
    }
`); */


// Define a shared struct (between hooks of this hookset)
DynLoaderInspector.hookSet.addHookShare({
    classloader: [],
    additionalDex: []
});

// prologue module
//KeystoreInspector.hookSet.require("StringUtils");
DynLoaderInspector.hookSet.addIntercept({
    //when: HOOK.BEFORE,
    method: "java.lang.Class.getMethod(<java.lang.String><java.lang.Class>[])<java.lang.reflect.Method>",
    onMatch: function(ctx,event){
        DynLoaderInspector.emits("hook.reflect.method.get",event);
    },
    interceptAfter: `  
            var cls = Java.cast( ret.getDeclaringClass(), DEXC_MODULE.common.class.java.lang.Class);
            
            send({ 
                id:"@@__HOOK_ID__@@", 
                match: true, 
                data: {
                    name: cls.getName()+"."+arg0,
                    s: DEXC_MODULE.reflect.getMethodSignature(ret,arg1)
                },
                after: true, 
                msg: "Class.getMethod()", 
                action: "Update" 
            });

            //  if(!@@__CTX__@@_invokeHooked) @@__CTX__@@_startInvokeHooking();
    `
});

DynLoaderInspector.hookSet.addIntercept({
    //when: HOOK.BEFORE,
    method: "java.lang.Class.forName(<java.lang.String>)<java.lang.Class>",
    onMatch: function(ctx,event){
        DynLoaderInspector.emits("hook.reflect.class.get",event);
    },
    interceptAfter: `  

            //var cls = Java.cast( ret, DEXC_MODULE.common.class.java.lang.Class);

            //var types = Java.array( this.getParameterTypes(), DEXC_MODULE.common.class.java.lang.Class);

            send({ 
                id:"@@__HOOK_ID__@@", 
                match: true, 
                data: {
                    name: ret.getCanonicalName()
                },
                after: true, 
                msg: "Class.forName()", 
                action: "Update" 
            });
    `
});


/**
 * This hook is a custom hook, it means that all code is custom and manually
 * wrote. It is useful if you want create hook at runtime.
 * 
 * Its a delegate hook where the method is hooked if a condition into another hook
 */
/*
DynLoaderInspector.hookSet.addCustomHook({
    method: "java.lang.reflect.Method.invoke(<java.lang.Object><java.lang.Object>[])<java.lang.Object>",
    onMatch: function(ctx,event){
        DynLoaderInspector.emits("hook.reflect.method.call",event);
    },
    customCode: `  
        var @@__CTX__@@_invokeHooked = false;
        var meth_47fc55b2d470b2b68bef852491d2c0d8 = CLS.java.lang.reflect.Method.invoke.overload('java.lang.Object','[Ljava.lang.Object;');
        

        
        function @@__CTX__@@_startInvokeHooking(){

            meth_47fc55b2d470b2b68bef852491d2c0d8.implementation = function(arg0,arg1) {


                // ============ !! WARNING !! =================
                // Args parsing below introduce lof of instability
                // It can be commented
                // ========= !! END OF WARNING !! =================

                var param = DEXC_MODULE.reflect.castArray( 
                    DEXC_MODULE.common.class.java.lang.Object,
                    arg1 );
    
                var paramCls = [], cls = null;
    
                for(var i in param){
                    cls = Java.cast( param[i].getClass(), CLS.java.lang.Class);
                    paramCls.push( cls.getName());
                }
    
                              
                send({ id:"ZDI5YmYxN2Y5YjViZjlhMDAzYmJjZDUwZjU1MjAxMzI=", 
                    msg:"java.lang.reflect.Method.invoke([]) target", 
                    data:{
                        method: DEXC_MODULE.reflect.getMethodSignature(this, this.getParameterTypes()),
                        param: paramCls,
                        before:1
                    }, 
                    action:"None before", after:false  });
                
                var ret = meth_47fc55b2d470b2b68bef852491d2c0d8.call(this, arg0, arg1);
    
                if(isIntanceOf(ret,"java.lang.String")){
                    var str = Java.cast(ret, DEXC_MODULE.common.class.java.lang.String);
                    send({ id:"ZDI5YmYxN2Y5YjViZjlhMDAzYmJjZDUwZjU1MjAxMzI=", 
                    msg:"java.lang.reflect.Method.invoke([]) after", 
                    data:{
                        ret:str.toString(),
                        before:0
                    }, action:"None before", after:true  });
                }else{
                    send({ id:"ZDI5YmYxN2Y5YjViZjlhMDAzYmJjZDUwZjU1MjAxMzI=", 
                    msg:"java.lang.reflect.Method.invoke([]) after", 
                    data:{
                        ret:"[Object]",
                        before:0
                    }, action:"None before", after:true  });
                }
    
                
                return ret; 
            };

            @@__CTX__@@_invokeHooked = true;
        }
    `
});
*/
DynLoaderInspector.hookSet.addIntercept({
    //when: HOOK.BEFORE,
    method: "dalvik.system.DexFile.loadDex(<java.lang.String><java.lang.String><int>)<dalvik.system.DexFile>",
    onMatch: function(ctx,event){
        DynLoaderInspector.emits("hook.dex.load",event);
    },
    interceptBefore: `     
            send({ 
                id:"@@__HOOK_ID__@@", 
                match: true, 
                data: {
                    arg0: arguments[0],
                    arg1: arguments[1],
                    arg2: arguments[2]
                },
                after: true, 
                msg: "DexFile.loadDex()", 
                action:"Log" 
            });
    `
});


DynLoaderInspector.hookSet.addIntercept({
    //when: HOOK.BEFORE,
    method: [
        "dalvik.system.DexFile.<init>(<java.io.File>)<void>",
        "dalvik.system.DexFile.<init>(<java.lang.String>)<void>",
    ],
    onMatch: function(ctx,event){
        DynLoaderInspector.emits("hook.dex.new",event);
    },
    interceptBefore: `     
            if(isInstanceOf(arg0,"java.io.File"))
                path = arg0.getAbsolutePath();
            else
                path = arg0;

            send({ 
                id:"@@__HOOK_ID__@@", 
                match: true, 
                data: {
                    path: path,
                },
                after: true, 
                msg: "DexFile.loadDex()", 
                action:"Log" 
            });
    `
});

/*
DynLoaderInspector.hookSet.addProbe({
    //when: HOOK.BEFORE,
    method: "android.os.Parcelable$ClassLoaderCreator.createFromParcel(<android.os.Parcel><java.lang.ClassLoader>)<java.lang.Object>",
    onMatch: function(ctx,event){
        ctx.bus.send({ 
            type: "hook.classloader.new", 
            data: event 
        });
    },
    interceptBefore: `    
            
            var parcel = arg0;
            var cll = arg1;

            send({ 
                id:"@@__HOOK_ID__@@", 
                match: true, 
                data: {
                    arg0: arguments[0],
                    arg1: arguments[1],
                }
                after: true, 
                msg: "ClassLoaderCreator.createFromParcel()", 
                action:"Log" 
            });
    `
});

/*
dalvik.system.DexFile.<init>(<java.io.File>)<void>
Probe OFF  intercept xref	Field	dalvik.system.DexFile.<init>(<java.lang.String>)<void>
*/


// ====== CONFIG TASK ====== 


DynLoaderInspector.on("hook.dex.load", {
    task: function(ctx, event){
        Logger.info("[INSPECTOR][TASK] DynLoaderInspector new Dex file loaded ",event.data.path);
    }
});
DynLoaderInspector.on("hook.dex.new", {
    task: function(ctx, event){
        Logger.info("[INSPECTOR][TASK] DynLoaderInspector new Dex file", event.data.path);
    }
});
DynLoaderInspector.on("hook.reflect.class.get", {
    task: function(ctx, event){
        // get CFG
        //let db = ctx.analyze.db;

        // search if the method exists

        Logger.info("[INSPECTOR][TASK] DynLoaderInspector search Class ",event.data.signature);
    }
});
DynLoaderInspector.on("hook.reflect.method.get", {
    task: function(ctx, event){
        Logger.info("[INSPECTOR][TASK] DynLoaderInspector search Method ");
        if(event == null || event.data == null || event.data.data == null) return false;
        let data  = event.data.data;


        let meth = ctx.find.get.method(data.s);
        console.log(data);

        // potential method call

        /*
            let rettype = ctx.find.get.class(event.data.data.ret)

        // if meth == null, the method is unknow and the graph should be updated
        if(meth == null){
            let ref = new CLASS.Method();


            ref.setReturnType(event.data)
            

        }*/
    }
});
DynLoaderInspector.on("hook.reflect.method.call", {
    task: function(ctx, event){
        Logger.info("[INSPECTOR][TASK] DynLoaderInspector method invoked dynamically ");
        if(event == null || event.data == null || event.data.data == null) return false;
        let data  = event.data.data;


        let meth = ctx.find.get.method(data.s);
        console.log(data);

        /*
            let rettype = ctx.find.get.class(event.data.data.ret)

        // if meth == null, the method is unknow and the graph should be updated
        if(meth == null){
            let ref = new CLASS.Method();


            ref.setReturnType(event.data)
            

        }*/
    }
});

/**
 * Events below are trigged when the Analyzer found missing reference and 
 * ask to the dynamic loader to instrumente the method in order to discover
 * new elements.
 */
/*
DynLoaderInspector.on("app.missing.method", {
    task: function(ctx, event){
        Logger.info("[INSPECTOR][TASK] DynLoaderInspector enable capturing hook");

    }
});
DynLoaderInspector.on("app.missing.class", {
    task: function(ctx, event){
        Logger.info("[INSPECTOR][TASK] DynLoaderInspector enable capturing hooks");
    }
});*/

module.exports = DynLoaderInspector;