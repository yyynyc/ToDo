window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.FixtureAdapter.extend();

Todos.Router.map(function(){
	this.resource('todos', { path: '/' });
});

Todos.TodosRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('todo');
  }
});

Todos.TodosController = Ember.ArrayController.extend({
	actions: {
		createTodo: function(){
			var title = this.get('newTitle');
			if(!title) {return false;}
			if (!(title).trim()) {return;}

			var todo = this.store.createRecord('todo', {
				title: title,
				isCompleted: false
			});

			this.set('newTitle', '');
			todo.save;
		}
	}
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
	}.property('model.isCompleted')
});

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