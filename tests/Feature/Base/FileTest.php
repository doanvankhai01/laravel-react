<?php


namespace Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class FileTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }

  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_FILE_INDEX->value,
      EPermissions::P_FILE_STORE->value,
      EPermissions::P_FILE_SHOW->value,
      EPermissions::P_FILE_UPDATE->value,
      EPermissions::P_FILE_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    Storage::fake('public');
    $file = UploadedFile::fake()->create('file.pdf');
    $auth = $this->signIn($eRole, $permissions);
    $this->post('/api/files/', ['file' => $file])->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseCount('files', 1);

    $res = $this->get('/api/files/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      $data = $res['data'][0];
    }

    if ($eRole === ERole::USER) $data = File::factory()->create(['user_id' => $auth['id']])->getAttributes();
    $this->put('/api/files/' . $data['id'], $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $data['is_active'] = $data['isActive'];
      unset($data['isActive']);
      unset($data['createdAt']);
      unset($data['updatedAt']);
      $this->assertDatabaseHas('files', [...$data, 'path' => str_replace(env('APP_URL', 'http://localhost') . ':' . env('APP_PORT', '3000') . '/storage/', '', $data['path'])]);
    }

    $res = $this->get('/api/files/' . $data['id'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach ($data as $key => $value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
    }
    $this->delete('/api/files/' . $data['id'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('files', $data);
  }
}
