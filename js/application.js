window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.FixtureAdapter.extend();

Todos.Router.map(function(){
	this.resource('todos', { path: '/' }, function(){
		this.route('active');
		this.route('completed');
	});
});

Todos.TodosIndexRoute = Ember.Route.extend({
	model: function(){
		return this.modelFor('todos');
	}
});

Todos.TodosRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('todo');
  }
});

Todos.TodosActiveRoute = Ember.Route.extend({
	model: function(){
		return this.store.filter('todo', function(todo){
			return !todo.get('isCompleted')
		});
	},
	renderTemplate: function(controller) {
		this.render('todos/index', {controller: controller});
	}
}); 

Todos.TodosCompletedRoute = Ember.Route.extend({
	model: function(){
		return this.store.filter('todo', function(todo){
			return todo.get('isCompleted')
		});
	},
	renderTemplate: function(controller) {
		this.render('todos/index', {controller: controller});
	}
}); 

Todos.TodosController = Ember.ArrayController.extend({
	actions: {
		createTodo: function(){
			var title = this.get('newTitle');
			if (!title) {return false;}
			if (!title.trim()) {return;}

			var todo = this.store.createRecord('todo', {
				title: title,
				isCompleted: false
			});

			this.set('newTitle', '');
			todo.save;
		},
		clearCompleted: function(){
			var completed = this.filterBy('isCompleted', true);
			completed.invoke('deleteRecord');
			completed.invoke('save');
		}
	},
	hasCompleted: function(){
		return this.get('completed') > 0;
	}.property('completed'),

	completed: function(){
		return this.filterBy('isCompleted', true).get('length');
	}.property('@each.isCompleted'),

	remaining: function(){
		return this.filterBy('isCompleted', false).get('length');
	}.property('@each.isCompleted'),

	inflection: function(){
		return this.get('remaining') === 1? 'todo' : 'todos';
	}.property('remaining')
});

Todos.TodoController = Ember.ObjectController.extend({
	isCompleted: function(key, value){
		var model = this.get('model');
		if (value === undefined) {
			return model.get('isCompleted');
		} else {
			model.set('isCompleted', value);
			model.save;
			return value;
		}
	}.property('model.isCompleted'),
	actions: {
		editTodo: function(){
			this.set('isEditing', true);
		},
		acceptChanges: function(){
			this.set('isEditing', false);
			if (Ember.isEmpty(this.get('model.title'))){
				this.send('removeTodo');
			} else {
				this.get('model').save();
			}
		},
		removeTodo: function(){
			var todo = this.get('model');
			todo.deleteRecord();
			todo.save();
		}
	},
	isEditing: false
});

Todos.EditTodoView = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().focus();
	}
});

Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);

Todos.Todo = DS.Model.extend({
	title: DS.attr('string'),
	isCompleted: DS.attr('boolean')
});

Todos.Todo.FIXTURES = [
	 {
	   id: 1,
	   title: 'Learn Ember.js',
	   isCompleted: true
	 },
	 {
	   id: 2,
	   title: 'Fix bugs',
	   isCompleted: false
	 },
	 {
	   id: 3,
	   title: 'Profit!',
	   isCompleted: false
	 }
];